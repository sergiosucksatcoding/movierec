// Check authentication
if (!isAuthenticated()) {
    window.location.href = '/login';
    throw new Error('Not authenticated');
}

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Load user info
        const user = await apiRequest('/auth/me');
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage && user.username) {
            welcomeMessage.textContent = `Welcome back, ${user.username}!`;
        }

        // Load recommendations count
        try {
            const recommendations = await apiRequest('/recommendations/saved');
            const recommendationsCount = document.getElementById('recommendationsCount');
            if (recommendationsCount) {
                recommendationsCount.textContent = recommendations.length || 0;
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }

        // Load watchlist count
        try {
            const watchlist = await apiRequest('/watchlist');
            const watchlistCount = document.getElementById('watchlistCount');
            const watchedCount = document.getElementById('watchedCount');
            
            if (watchlistCount) {
                watchlistCount.textContent = watchlist.length || 0;
            }
            
            if (watchedCount) {
                const watched = watchlist.filter(item => item.watched);
                watchedCount.textContent = watched.length || 0;
            }

            // Create chart
            createActivityChart(watchlist);
        } catch (error) {
            console.error('Error loading watchlist:', error);
        }

        // Load user preferences
        if (user.preferences && user.preferences.favoriteGenres) {
            const genresList = document.getElementById('genresList');
            if (genresList) {
                if (user.preferences.favoriteGenres.length > 0) {
                    genresList.innerHTML = user.preferences.favoriteGenres
                        .map(genre => `<span class="genre-tag">${genre}</span>`)
                        .join('');
                } else {
                    genresList.innerHTML = '<p>No genres selected yet. Search for movies to build your preferences!</p>';
                }
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function createActivityChart(watchlist) {
    const ctx = document.getElementById('activityChart');
    if (!ctx || !window.Chart || watchlist.length === 0) return;

    // Count by type
    const movies = watchlist.filter(item => item.type === 'movie').length;
    const tvShows = watchlist.filter(item => item.type === 'tv').length;
    const watched = watchlist.filter(item => item.watched).length;
    const unwatched = watchlist.filter(item => !item.watched).length;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Movies', 'TV Shows', 'Watched', 'Unwatched'],
            datasets: [{
                label: 'Count',
                data: [movies, tvShows, watched, unwatched],
                backgroundColor: '#ffd700',
                borderColor: '#ffd700',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            }
        }
    });
}

