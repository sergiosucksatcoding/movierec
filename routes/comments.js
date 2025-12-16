const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Get comments for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const comments = await Comment.find({ 
            movieId: parseInt(movieId),
            parentCommentId: null 
        })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await Comment.find({ 
                    parentCommentId: comment._id 
                })
                .populate('userId', 'username')
                .sort({ createdAt: 1 });
                
                return {
                    ...comment.toObject(),
                    replies
                };
            })
        );

        res.json(commentsWithReplies);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// Create a comment
router.post('/', auth, async (req, res) => {
    try {
        const { movieId, text, parentCommentId } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const comment = new Comment({
            movieId: parseInt(movieId),
            userId: req.userId,
            username: user.username,
            text,
            parentCommentId: parentCommentId || null
        });

        await comment.save();
        await comment.populate('userId', 'username');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment' });
    }
});

// Like/Dislike a comment
router.post('/:id/reaction', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { reaction } = req.body; // 'like' or 'dislike'
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove user from both arrays first
        comment.likes = comment.likes.filter(
            likeId => likeId.toString() !== req.userId.toString()
        );
        comment.dislikes = comment.dislikes.filter(
            dislikeId => dislikeId.toString() !== req.userId.toString()
        );

        // Add to appropriate array
        if (reaction === 'like') {
            comment.likes.push(req.userId);
        } else if (reaction === 'dislike') {
            comment.dislikes.push(req.userId);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error('Error updating reaction:', error);
        res.status(500).json({ message: 'Error updating reaction' });
    }
});

// Delete a comment (only by the author)
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete all replies first
        await Comment.deleteMany({ parentCommentId: comment._id });
        
        // Delete the comment
        await Comment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

module.exports = router;