# Code Structure & File Locations

## 📁 Complete Project Structure

```
portfolio-website/
│
├── 🚀 BACKEND FILES (Server-side)
│   ├── server.js                    # Main server entry point
│   ├── package.json                 # Dependencies & scripts
│   ├── .gitignore                   # Git ignore file
│   │
│   ├── 📂 models/                   # Database models
│   │   ├── User.js                  # User model (with password hashing)
│   │   ├── Recommendation.js        # Recommendation model
│   │   └── Watchlist.js             # Watchlist model
│   │
│   ├── 📂 routes/                   # API routes
│   │   ├── auth.js                  # Authentication routes (register, login)
│   │   ├── movies.js                # Movie/TV search routes (TMDB API)
│   │   ├── recommendations.js       # Recommendation engine routes
│   │   └── watchlist.js             # Watchlist CRUD routes
│   │
│   ├── 📂 middleware/               # Middleware functions
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   └── 📂 tests/                    # Test files
│       ├── auth.test.js             # Authentication tests
│       ├── watchlist.test.js        # Watchlist CRUD tests
│       └── validation.test.js       # Input validation tests
│
├── 🎨 FRONTEND FILES (Client-side)
│   └── 📂 public/                   # All frontend files served to browser
│       │
│       ├── 📄 HTML Pages
│       │   ├── index.html           # Landing page
│       │   ├── login.html           # Login page
│       │   ├── register.html        # Registration page
│       │   ├── dashboard.html       # User dashboard
│       │   ├── recommendations.html # Recommendations page
│       │   └── watchlist.html       # Watchlist page
│       │
│       ├── 💻 JavaScript Files
│       │   ├── app.js               # Common utilities (API calls, auth)
│       │   ├── auth.js              # Authentication logic
│       │   ├── dashboard.js         # Dashboard functionality
│       │   ├── recommendations.js   # Recommendations page logic
│       │   └── watchlist.js         # Watchlist page logic
│       │
│       └── 🎨 CSS
│           └── styles.css           # All styling (black/yellow theme)
│
└── 📚 DOCUMENTATION
    ├── MOVIE_APP_README.md          # Complete application documentation
    ├── QUICK_START.md               # Quick setup guide
    ├── PRODUCTION_CHECKLIST.md      # Production deployment guide
    ├── REQUIREMENTS_COMPLIANCE.md   # Requirements checklist
    ├── REQUIREMENTS_SUMMARY.md      # Quick compliance summary
    ├── README_TESTING.md            # Testing documentation
    └── CODE_STRUCTURE.md            # This file!
```

---

## 🔍 Key File Locations

### Main Entry Point
- **`server.js`** - Starts the Express server, connects to MongoDB, sets up routes

### Backend API Routes
- **`routes/auth.js`** - User registration, login, authentication
- **`routes/movies.js`** - Movie/TV search using TMDB API
- **`routes/recommendations.js`** - Personalized recommendations
- **`routes/watchlist.js`** - Watchlist CRUD operations

### Database Models
- **`models/User.js`** - User schema with password hashing
- **`models/Recommendation.js`** - Recommendation data structure
- **`models/Watchlist.js`** - Watchlist item structure

### Frontend Pages
- **`public/index.html`** - Landing/home page
- **`public/login.html`** - Login form
- **`public/register.html`** - Registration form
- **`public/dashboard.html`** - User dashboard with stats
- **`public/recommendations.html`** - Movie recommendations display
- **`public/watchlist.html`** - User's watchlist

### Frontend JavaScript
- **`public/app.js`** - Common functions (API calls, token management, hamburger menu)
- **`public/auth.js`** - Login/register form handling
- **`public/dashboard.js`** - Dashboard data loading and charts
- **`public/recommendations.js`** - Recommendation loading and search
- **`public/watchlist.js`** - Watchlist management

### Styling
- **`public/styles.css`** - All CSS styling (black background, yellow accents)

---

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (see QUICK_START.md)

3. **Start server:**
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## 📝 File Purposes

| File | Purpose |
|------|---------|
| `server.js` | Main server - connects everything together |
| `routes/auth.js` | Handles user registration and login |
| `routes/movies.js` | Integrates with TMDB API for movie data |
| `routes/recommendations.js` | Generates personalized recommendations |
| `routes/watchlist.js` | Manages user's saved movies/TV shows |
| `models/User.js` | Database schema for users (with password hashing) |
| `middleware/auth.js` | Protects routes that require login |
| `public/app.js` | Frontend utility functions |
| `public/*.html` | User-facing web pages |
| `public/styles.css` | All visual styling |

---

## 🧪 Testing

Run tests from the root directory:
```bash
npm test
```

Test files are in the `tests/` folder.

---

## 📦 Dependencies

All dependencies are listed in `package.json`. Install with:
```bash
npm install
```

Key dependencies:
- `express` - Web framework
- `mongoose` - MongoDB driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `axios` - HTTP client for TMDB API
- `express-validator` - Input validation

