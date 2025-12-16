// Check authentication
if (!isAuthenticated()) {
    window.location.href = '/login';
    throw new Error('Not authenticated');
}

// Load watchlist on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadWatchlist();
});

async function loadWatchlist() {
    const grid = document.getElementById('watchlistGrid');
    const loading = document.getElementById('loadingIndicator');
    const emptyState = document.getElementById('emptyWatchlist');
    
    if (loading) loading.style.display = 'block';
    if (grid) grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'none';

    try {
        const watchlist = await apiRequest('/watchlist');
        
        if (loading) loading.style.display = 'none';
        
        if (watchlist && watchlist.length > 0) {
            displayWatchlist(watchlist, grid);
        } else {
            if (grid) grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading watchlist:', error);
        if (loading) loading.style.display = 'none';
        if (grid) {
            grid.innerHTML = `<p class="error">Error loading watchlist: ${error.message}</p>`;
        }
    }
}

function displayWatchlist(items, container) {
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="movie-card">
            ${item.posterPath ? 
                `<a href="/movie?id=${item.movieId}" style="display: block; cursor: pointer;"><img src="${item.posterPath}" alt="${item.title}" class="movie-poster" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23ffd700%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'"></a>` : 
                `<a href="/movie?id=${item.movieId}" style="display: block; cursor: pointer;"><div class="movie-poster-placeholder">No Image</div></a>`
            }
            <div class="movie-info">
                <h3><a href="/movie?id=${item.movieId}" style="color: var(--accent-color); text-decoration: none;">${item.title}</a></h3>
                ${item.type ? `<p class="movie-type">${item.type.toUpperCase()}</p>` : ''}
                ${item.overview ? `<p class="movie-overview">${item.overview.substring(0, 150)}...</p>` : ''}
                <div class="watchlist-status">
                    <label>
                        <input type="checkbox" ${item.watched ? 'checked' : ''} onchange="toggleWatched('${item._id}', this.checked)">
                        Watched
                    </label>
                </div>
                <div class="movie-actions">
                    <button class="btn btn-outline btn-small" onclick="removeFromWatchlist('${item._id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function toggleWatched(id, watched) {
    try {
        await apiRequest(`/watchlist/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ watched })
        });
    } catch (error) {
        console.error('Error updating watchlist:', error);
        alert('Error updating watchlist: ' + error.message);
    }
}

async function removeFromWatchlist(id) {
    if (!confirm('Remove from watchlist?')) return;

    try {
        await apiRequest(`/watchlist/${id}`, {
            method: 'DELETE'
        });
        
        await loadWatchlist(); // Reload watchlist
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        alert('Error removing from watchlist: ' + error.message);
    }
}

