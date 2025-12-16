/**
 * Authentication Middleware
 * Verifies JWT token from request headers and attaches userId to request object
 * 
 * This middleware is used to protect routes that require authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Headers Required:
 * - Authorization: Bearer <JWT_TOKEN>
 * 
 * On Success:
 * - Attaches req.userId with the user's ID from the token
 * - Calls next() to proceed to the route handler
 * 
 * On Failure:
 * - Returns 401 Unauthorized status
 */

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;

