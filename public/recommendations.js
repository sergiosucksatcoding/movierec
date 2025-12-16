// Check authentication
if (!isAuthenticated()) {
    window.location.href = '/login';
    throw new Error('Not authenticated');
}

// Load recommendations on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadRecommendations();
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    if (getRecommendationsBtn) {
        getRecommendationsBtn.addEventListener('click', loadRecommendations);
    }
});

async function loadRecommendations() {
    const grid = document.getElementById('recommendationsGrid');
    const loading = document.getElementById('loadingIndicator');
    
    if (loading) loading.style.display = 'block';
    if (grid) grid.innerHTML = '';

    try {
        const data = await apiRequest('/recommendations');
        
        if (loading) loading.style.display = 'none';
        
        if (data.recommendations && data.recommendations.length > 0) {
            displayMovies(data.recommendations, grid);
        } else {
            if (grid) {
                grid.innerHTML = '<p>No recommendations available. Try updating your preferences!</p>';
            }
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        if (loading) loading.style.display = 'none';
        if (grid) {
            grid.innerHTML = `<p class="error">Error loading recommendations: ${error.message}</p>`;
        }
    }
}

async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput?.value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    const grid = document.getElementById('recommendationsGrid');
    const loading = document.getElementById('loadingIndicator');
    
    if (loading) loading.style.display = 'block';
    if (grid) grid.innerHTML = '';

    try {
        // Search for movies
        const movieData = await apiRequest(`/movies/search?query=${encodeURIComponent(query)}`);
        
        if (loading) loading.style.display = 'none';
        
        if (movieData.results && movieData.results.length > 0) {
            const formattedMovies = movieData.results.map(movie => ({
                movieId: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                releaseDate: movie.release_date,
                rating: movie.vote_average
            }));
            
            displayMovies(formattedMovies, grid);
        } else {
            if (grid) {
                grid.innerHTML = '<p>No results found. Try a different search term.</p>';
            }
        }
    } catch (error) {
        console.error('Error searching:', error);
        if (loading) loading.style.display = 'none';
        if (grid) {
            grid.innerHTML = `<p class="error">Error searching: ${error.message}</p>`;
        }
    }
}

function displayMovies(movies, container) {
    if (!container) return;

    container.innerHTML = movies.map(movie => `
        <div class="movie-card">
            ${movie.posterPath ? 
                `<a href="/movie?id=${movie.movieId}" style="display: block; cursor: pointer;"><img src="${movie.posterPath}" alt="${movie.title}" class="movie-poster" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect fill=%22%231a1a1a%22 width=%22300%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23ffd700%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'"></a>` : 
                `<a href="/movie?id=${movie.movieId}" style="display: block; cursor: pointer;"><div class="movie-poster-placeholder">No Image</div></a>`
            }
            <div class="movie-info">
                <h3><a href="/movie?id=${movie.movieId}" style="color: var(--accent-color); text-decoration: none;">${movie.title}</a></h3>
                ${movie.rating ? `<p class="movie-rating">⭐ ${movie.rating.toFixed(1)}</p>` : ''}
                ${movie.releaseDate ? `<p class="movie-date">${new Date(movie.releaseDate).getFullYear()}</p>` : ''}
                ${movie.overview ? `<p class="movie-overview">${movie.overview.substring(0, 150)}...</p>` : ''}
                <div class="movie-actions">
                    <button class="btn btn-outline btn-small" onclick="addToWatchlist(${movie.movieId}, '${movie.title.replace(/'/g, "\\'")}', '${movie.posterPath || ''}')">Add to Watchlist</button>
                </div>
            </div>
        </div>
    `).join('');
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

