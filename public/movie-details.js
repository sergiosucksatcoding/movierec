// Check authentication
if (!isAuthenticated()) {
    window.location.href = '/login';
    throw new Error('Not authenticated');
}

let currentMovieId = null;

// Get movie ID from URL
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentMovieId = urlParams.get('id');

    if (!currentMovieId) {
        document.getElementById('movieDetails').innerHTML = '<p class="error">No movie ID provided</p>';
        return;
    }

    await loadMovieDetails();
    await loadReviews();
    await loadComments();
});

async function loadMovieDetails() {
    try {
        const movie = await apiRequest(`/movies/${currentMovieId}`);
        
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null;

        const backdropUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : null;

        document.getElementById('movieDetails').innerHTML = `
            <div class="movie-details-header" ${backdropUrl ? `style="background-image: url('${backdropUrl}')"` : ''}>
                <div class="movie-details-content">
                    ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" class="movie-details-poster">` : ''}
                    <div class="movie-details-info">
                        <h1>${movie.title}</h1>
                        <div class="movie-meta">
                            ${movie.release_date ? `<span>${new Date(movie.release_date).getFullYear()}</span>` : ''}
                            ${movie.runtime ? `<span>${movie.runtime} min</span>` : ''}
                            ${movie.vote_average ? `<span>⭐ ${movie.vote_average.toFixed(1)}</span>` : ''}
                        </div>
                        ${movie.genres && movie.genres.length > 0 ? `
                            <div class="movie-genres">
                                ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="movie-description">
                            <h3>Overview</h3>
                            <p>${movie.overview || 'No description available.'}</p>
                        </div>
                        <button class="btn btn-primary" onclick="addToWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${posterUrl || ''}')">Add to Watchlist</button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading movie details:', error);
        document.getElementById('movieDetails').innerHTML = `<p class="error">Error loading movie: ${error.message}</p>`;
    }
}

async function loadReviews() {
    try {
        const data = await apiRequest(`/movies/${currentMovieId}/reviews`);
        const reviews = data.results || [];

        const container = document.getElementById('reviewsContainer');
        if (reviews.length === 0) {
            container.innerHTML = '<p>No reviews available from TMDB.</p>';
            return;
        }

        container.innerHTML = reviews.slice(0, 5).map(review => `
            <div class="review-card">
                <div class="review-header">
                    <strong>${review.author}</strong>
                    <span class="review-rating">⭐ ${review.author_details.rating || 'N/A'}</span>
                </div>
                <p class="review-content">${review.content}</p>
                <a href="${review.url}" target="_blank" class="review-link">Read full review on TMDB</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsContainer').innerHTML = '<p>Error loading reviews.</p>';
    }
}

async function loadComments() {
    try {
        const comments = await apiRequest(`/comments/movie/${currentMovieId}`);
        displayComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
        document.getElementById('commentsContainer').innerHTML = '<p>Error loading comments.</p>';
    }
}

function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    
    if (comments.length === 0) {
        container.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }

    container.innerHTML = comments.map(comment => `
        <div class="comment-card" data-comment-id="${comment._id}">
            <div class="comment-header">
                <strong>${comment.username}</strong>
                <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
            <div class="comment-actions">
                <button class="btn-reaction" onclick="toggleReaction('${comment._id}', 'like')">
                    👍 ${comment.likes ? comment.likes.length : 0}
                </button>
                <button class="btn-reaction" onclick="toggleReaction('${comment._id}', 'dislike')">
                    👎 ${comment.dislikes ? comment.dislikes.length : 0}
                </button>
                <button class="btn-reply" onclick="showReplyForm('${comment._id}')">Reply</button>
                ${comment.userId._id === getCurrentUserId() ? `
                    <button class="btn-delete" onclick="deleteComment('${comment._id}')">Delete</button>
                ` : ''}
            </div>
            <div id="replyForm-${comment._id}" class="reply-form" style="display: none;">
                <textarea id="replyText-${comment._id}" placeholder="Write your reply..." rows="2"></textarea>
                <button class="btn btn-primary btn-small" onclick="submitReply('${comment._id}')">Post Reply</button>
            </div>
            ${comment.replies && comment.replies.length > 0 ? `
                <div class="replies">
                    ${comment.replies.map(reply => `
                        <div class="reply-card">
                            <div class="comment-header">
                                <strong>${reply.username}</strong>
                                <span class="comment-date">${new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                            <div class="comment-actions">
                                <button class="btn-reaction" onclick="toggleReaction('${reply._id}', 'like')">
                                    👍 ${reply.likes ? reply.likes.length : 0}
                                </button>
                                <button class="btn-reaction" onclick="toggleReaction('${reply._id}', 'dislike')">
                                    👎 ${reply.dislikes ? reply.dislikes.length : 0}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function submitComment() {
    const text = document.getElementById('commentText').value.trim();
    
    if (!text) {
        alert('Please enter a comment');
        return;
    }

    try {
        await apiRequest('/comments', {
            method: 'POST',
            body: JSON.stringify({
                movieId: currentMovieId,
                text
            })
        });

        document.getElementById('commentText').value = '';
        await loadComments();
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Error submitting comment: ' + error.message);
    }
}

async function submitReply(parentCommentId) {
    const text = document.getElementById(`replyText-${parentCommentId}`).value.trim();
    
    if (!text) {
        alert('Please enter a reply');
        return;
    }

    try {
        await apiRequest('/comments', {
            method: 'POST',
            body: JSON.stringify({
                movieId: currentMovieId,
                text,
                parentCommentId
            })
        });

        document.getElementById(`replyText-${parentCommentId}`).value = '';
        document.getElementById(`replyForm-${parentCommentId}`).style.display = 'none';
        await loadComments();
    } catch (error) {
        console.error('Error submitting reply:', error);
        alert('Error submitting reply: ' + error.message);
    }
}

function showReplyForm(commentId) {
    const form = document.getElementById(`replyForm-${commentId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function toggleReaction(commentId, reaction) {
    try {
        await apiRequest(`/comments/${commentId}/reaction`, {
            method: 'POST',
            body: JSON.stringify({ reaction })
        });
        await loadComments();
    } catch (error) {
        console.error('Error updating reaction:', error);
        alert('Error updating reaction: ' + error.message);
    }
}

async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    try {
        await apiRequest(`/comments/${commentId}`, {
            method: 'DELETE'
        });
        await loadComments();
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error deleting comment: ' + error.message);
    }
}

function getCurrentUserId() {
    // This would need to be stored when user logs in
    // For now, we'll get it from the token or user info
    return null; // You'll need to implement this
}

async function addToWatchlist(movieId, title, posterPath) {
    try {
        await apiRequest('/watchlist', {
            method: 'POST',
            body: JSON.stringify({
                movieId,
                title,
                posterPath,
                type: 'movie'
            })
        });
        
        alert('Added to watchlist!');
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        alert('Error adding to watchlist: ' + error.message);
    }
}