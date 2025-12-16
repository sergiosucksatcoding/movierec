// API Base URL
const API_BASE_URL = window.location.origin;

// Token management
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            removeToken();
            window.location.href = '/login';
        });
    }

    // Check authentication for protected pages
    const protectedPages = ['/dashboard', '/recommendations', '/watchlist'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.includes(currentPath) && !isAuthenticated()) {
        window.location.href = '/login';
    }
});
// Load popular movies for home page carousel
// Load popular movies for home page carousel
async function loadMovieCarousel() {
    const carouselTrack = document.getElementById('movieCarousel');
    if (!carouselTrack) return; // Only run on home page

    try {
        const data = await apiRequest('/movies/popular?page=1');
        const movies = data.results || [];
        
        if (movies.length === 0) return;

        // Create poster items (duplicate for seamless loop)
        const posterItems = movies.map(movie => {
            const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null;
            
            const item = document.createElement('div');
            item.className = 'movie-poster-item';
            
            // Create clickable link
            const link = document.createElement('a');
            link.href = `/movie?id=${movie.id}`;
            link.style.display = 'block';
            link.style.cursor = 'pointer';
            
            if (posterUrl) {
                const img = document.createElement('img');
                img.src = posterUrl;
                img.alt = movie.title || movie.name || 'Movie poster';
                img.loading = 'lazy';
                link.appendChild(img);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'movie-poster-placeholder';
                placeholder.textContent = movie.title || movie.name || '🎬';
                link.appendChild(placeholder);
            }
            
            item.appendChild(link);
            return item;
        });

        // Add posters twice for seamless infinite scroll
        posterItems.forEach(item => carouselTrack.appendChild(item.cloneNode(true)));
        posterItems.forEach(item => carouselTrack.appendChild(item.cloneNode(true)));

        console.log(`Loaded ${movies.length} movies for carousel`);

    } catch (error) {
        console.error('Error loading movie carousel:', error);
        // Show a message in the carousel if it fails
        const carouselTrack = document.getElementById('movieCarousel');
        if (carouselTrack) {
            carouselTrack.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Unable to load movies. Please check your TMDB API key.</div>';
        }
    }
}

// Load carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMovieCarousel);
} else {
    loadMovieCarousel();
}
