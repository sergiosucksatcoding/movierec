# Movie & TV Recommendation Web Application

A full-stack cloud-based web application that provides personalized movie and TV show recommendations based on user preferences. Built with Node.js, Express.js, MongoDB, and integrated with The Movie Database (TMDB) API.

## 🎯 Project Overview

**Business Case**: Help users discover new movies and TV shows tailored to their preferences, reducing decision fatigue and improving entertainment discovery.

**Solution**: A personalized recommendation platform with user authentication, preference tracking, watchlist management, and intelligent recommendations.

## ✨ Features

### Core Requirements

- ✅ **User Registration & Authentication**
  - Secure user account creation
  - Password hashing with bcryptjs
  - JWT token-based authentication
  - Protected routes and API endpoints

- ✅ **Data Storage & Management (CRUD)**
  - MongoDB database with Mongoose ODM
  - User profiles with preferences
  - Recommendations storage
  - Watchlist management
  - Full CRUD operations for all data

- ✅ **Data Retrieval & Presentation**
  - Personalized recommendations based on user preferences
  - Movie/TV search functionality
  - Watchlist with watched/unwatched status
  - Dashboard with user statistics
  - Data visualization with Chart.js

- ✅ **Responsive Front-End Design**
  - Modern, responsive design with black background and yellow accents
  - Works seamlessly on desktop, tablet, and mobile devices
  - Interactive UI with smooth animations

- ✅ **Cloud Deployment Ready**
  - Configured for deployment to cloud platforms (AWS, GCP, Azure, Vercel)
  - MongoDB Atlas compatible
  - Environment variable configuration

### Additional Features

- ✅ **API Integration**: TMDB (The Movie Database) API for movie/TV data
- ✅ **Data Visualization**: Chart.js for user activity and preferences
- ✅ **Watchlist Management**: Save, track, and rate movies/TV shows

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Axios for API calls

**Frontend:**
- HTML5 (Semantic)
- CSS3 (Responsive design)
- JavaScript (Vanilla)
- Chart.js for visualizations

**Database:**
- MongoDB (local or MongoDB Atlas)

**External APIs:**
- The Movie Database (TMDB) API

## 📁 Project Structure

```
movie-recommendation-app/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── models/                   # MongoDB models
│   ├── User.js              # User model
│   ├── Recommendation.js    # Recommendation model
│   └── Watchlist.js         # Watchlist model
├── routes/                   # API routes
│   ├── auth.js              # Authentication routes
│   ├── movies.js            # Movie/TV search routes
│   ├── recommendations.js   # Recommendation routes
│   └── watchlist.js         # Watchlist routes
├── middleware/               # Middleware
│   └── auth.js              # JWT authentication middleware
└── public/                   # Frontend files
    ├── index.html           # Landing page
    ├── login.html           # Login page
    ├── register.html        # Registration page
    ├── dashboard.html       # User dashboard
    ├── recommendations.html # Recommendations page
    ├── watchlist.html       # Watchlist page
    ├── styles.css           # Main stylesheet
    ├── app.js               # Common JavaScript utilities
    ├── auth.js              # Authentication logic
    ├── dashboard.js         # Dashboard functionality
    ├── recommendations.js   # Recommendations functionality
    └── watchlist.js         # Watchlist functionality
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- TMDB API key (free at https://www.themoviedb.org/settings/api)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-recommendations
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-recommendations
   
   JWT_SECRET=your-secret-key-change-this-in-production
   TMDB_API_KEY=your-tmdb-api-key-here
   PORT=3000
   ```

3. **Start MongoDB** (if using local MongoDB)
   - On Windows: Start MongoDB service
   - On Mac/Linux: `mongod` or `brew services start mongodb-community`

4. **Get TMDB API Key**
   - Go to https://www.themoviedb.org/
   - Create a free account
   - Go to Settings → API
   - Request an API key (it's free)
   - Copy the API key to your `.env` file

5. **Run the Application**
   ```bash
   # Development mode (with nodemon for auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Movies/TV
- `GET /api/movies/search?query=...` - Search movies
- `GET /api/movies/search-tv?query=...` - Search TV shows
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/tv/:id` - Get TV show details
- `GET /api/movies/genres/list` - Get genres list

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations (requires auth)
- `GET /api/recommendations/saved` - Get saved recommendations (requires auth)
- `PUT /api/recommendations/:id` - Update recommendation (requires auth)
- `DELETE /api/recommendations/:id` - Delete recommendation (requires auth)

### Watchlist
- `GET /api/watchlist` - Get user watchlist (requires auth)
- `POST /api/watchlist` - Add to watchlist (requires auth)
- `PUT /api/watchlist/:id` - Update watchlist item (requires auth)
- `DELETE /api/watchlist/:id` - Remove from watchlist (requires auth)

## 🌐 Deployment

### Option 1: Deploy to Vercel (Recommended for Frontend + Backend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables (MONGODB_URI, JWT_SECRET, TMDB_API_KEY)

### Option 2: Deploy to Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set TMDB_API_KEY=your-api-key
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Deploy to AWS/GCP/Azure

**For AWS:**
- Use AWS Elastic Beanstalk or EC2
- Set up MongoDB Atlas (cloud database)
- Configure environment variables

**For GCP:**
- Use Google App Engine or Cloud Run
- Set up MongoDB Atlas
- Configure environment variables

**For Azure:**
- Use Azure App Service
- Set up MongoDB Atlas or Azure Cosmos DB
- Configure environment variables

### Database Setup (MongoDB Atlas - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get your connection string
6. Update `MONGODB_URI` in your `.env` file

## 🧪 Testing the Application

1. **Register a new account**
   - Go to `/register`
   - Fill in username, email, and password
   - Click "Create Account"

2. **Login**
   - Go to `/login`
   - Enter your credentials
   - You'll be redirected to dashboard

3. **Get Recommendations**
   - Go to `/recommendations`
   - Click "Get Recommendations" to see personalized suggestions
   - Search for movies/TV shows using the search bar

4. **Manage Watchlist**
   - Go to `/watchlist`
   - Add movies/TV shows from recommendations
   - Mark items as watched/unwatched
   - Remove items from watchlist

5. **View Dashboard**
   - Go to `/dashboard`
   - See your statistics and activity charts

## 📊 Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  preferences: {
    favoriteGenres: [String],
    favoriteMovies: [Number],
    favoriteTVShows: [Number]
  },
  createdAt: Date
}
```

### Recommendation Model
```javascript
{
  userId: ObjectId,
  movieId: Number,
  title: String,
  posterPath: String,
  overview: String,
  releaseDate: String,
  rating: Number,
  recommendationScore: Number,
  viewed: Boolean,
  userRating: Number,
  createdAt: Date
}
```

### Watchlist Model
```javascript
{
  userId: ObjectId,
  movieId: Number,
  title: String,
  posterPath: String,
  overview: String,
  releaseDate: String,
  type: String ('movie' or 'tv'),
  watched: Boolean,
  userRating: Number,
  addedAt: Date
}
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation with express-validator
- Secure password requirements (min 6 characters)

## 🎨 Design Features

- Black background with yellow accents
- Responsive design for all devices
- Smooth animations and transitions
- Accessible UI with proper ARIA labels
- Modern, clean interface

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running (if using local)
- Check MongoDB Atlas connection string
- Verify network access in MongoDB Atlas

**TMDB API Errors:**
- Verify API key is correct
- Check API key permissions in TMDB dashboard
- Ensure API key is not rate-limited

**Authentication Issues:**
- Clear browser localStorage
- Check JWT_SECRET in .env
- Verify token expiration (7 days default)

## 📚 Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Created as a full-stack web application assignment.

---

**Note**: Make sure to replace placeholder API keys and secrets with your own values before deploying to production!

