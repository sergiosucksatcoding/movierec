/**
 * Authentication Routes
 * Handles user registration, login, and authentication
 * 
 * Security Features:
 * - Password hashing using bcryptjs (handled in User model)
 * - JWT token-based authentication
 * - Input validation using express-validator
 * 
 * @requires express
 * @requires jsonwebtoken - For generating and verifying JWT tokens
 * @requires express-validator - For input validation and sanitization
 * @requires ../models/User - User database model
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// JWT secret key from environment variables (required for production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * Request Body:
 * - username (string, 3-30 characters)
 * - email (string, valid email format)
 * - password (string, minimum 6 characters)
 * 
 * Response:
 * - 201: Success - Returns JWT token and user info
 * - 400: Validation error or user already exists
 * - 500: Server error
 */
router.post('/register', [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
            preferences: {
                favoriteGenres: [],
                favoriteMovies: [],
                favoriteTVShows: []
            }
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

/**
 * POST /api/auth/login
 * Authenticate existing user and return JWT token
 * 
 * Request Body:
 * - email (string, valid email format)
 * - password (string, required)
 * 
 * Response:
 * - 200: Success - Returns JWT token and user info
 * - 400: Invalid credentials or validation error
 * - 500: Server error
 */
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

/**
 * GET /api/auth/me
 * Get current authenticated user's information
 * Requires authentication token in Authorization header
 * 
 * Headers:
 * - Authorization: Bearer <JWT_TOKEN>
 * 
 * Response:
 * - 200: Success - Returns user object (without password)
 * - 401: Unauthorized - Invalid or missing token
 * - 404: User not found
 * - 500: Server error
 */
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * PUT /api/auth/me
 * Update current authenticated user's profile
 * Requires authentication token in Authorization header
 * 
 * Request Body (all optional):
 * - username (string, 3-30 characters)
 * - email (string, valid email format)
 * - password (string, minimum 6 characters)
 * - preferences (object with favoriteGenres, favoriteMovies, favoriteTVShows)
 * 
 * Headers:
 * - Authorization: Bearer <JWT_TOKEN>
 * 
 * Response:
 * - 200: Success - Returns updated user object (without password)
 * - 400: Validation error or email/username already taken
 * - 401: Unauthorized - Invalid or missing token
 * - 404: User not found
 * - 500: Server error
 */
router.put('/me', require('../middleware/auth'), [
    body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, password, preferences } = req.body;

        // Check if username or email is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already taken' });
            }
            user.email = email;
        }

        // Update password if provided
        if (password) {
            user.password = password; // Will be hashed by the pre-save hook
        }

        // Update preferences if provided
        if (preferences) {
            user.preferences = {
                ...user.preferences,
                ...preferences
            };
        }

        await user.save();

        // Return user without password
        const userResponse = await User.findById(req.userId).select('-password');
        res.json(userResponse);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error updating user' });
    }
});

/**
 * DELETE /api/auth/me
 * Delete current authenticated user's account
 * Requires authentication token in Authorization header
 * 
 * Headers:
 * - Authorization: Bearer <JWT_TOKEN>
 * 
 * Response:
 * - 200: Success - Returns confirmation message
 * - 401: Unauthorized - Invalid or missing token
 * - 404: User not found
 * - 500: Server error
 */
router.delete('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: Delete associated data (watchlist, recommendations, comments)
        // You can add cleanup here if needed
        const Watchlist = require('../models/Watchlist');
        const Recommendation = require('../models/Recommendation');
        const Comment = require('../models/Comment');

        // Delete user's watchlist items
        await Watchlist.deleteMany({ userId: req.userId });
        
        // Delete user's recommendations
        await Recommendation.deleteMany({ userId: req.userId });
        
        // Delete user's comments
        await Comment.deleteMany({ userId: req.userId });

        // Delete the user account
        await User.findByIdAndDelete(req.userId);

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
});

module.exports = router;
module.exports = router;

