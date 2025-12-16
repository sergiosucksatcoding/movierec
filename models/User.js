/**
 * User Model
 * MongoDB schema and model for user accounts
 * 
 * Features:
 * - Secure password hashing using bcryptjs
 * - User preferences storage (genres, favorite movies/TV shows)
 * - Password comparison method for authentication
 * 
 * @requires mongoose - MongoDB object modeling
 * @requires bcryptjs - Password hashing library
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    preferences: {
        favoriteGenres: [String],
        favoriteMovies: [Number], // TMDB movie IDs
        favoriteTVShows: [Number] // TMDB TV IDs
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-save Hook: Password Hashing
 * Automatically hashes the user's password before saving to database
 * Uses bcryptjs with salt rounds of 10 for secure password storage
 * 
 * @param {Function} next - Mongoose middleware next function
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare Password Method
 * Compares a candidate password with the stored hashed password
 * Used during user login authentication
 * 
 * @param {String} candidatePassword - The password to compare (plain text)
 * @returns {Boolean} - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

