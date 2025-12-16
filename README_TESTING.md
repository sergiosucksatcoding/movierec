# Testing Documentation

## Overview

This application includes comprehensive test suites to ensure functionality, reliability, and security. Tests are written using Mocha, Chai, and Supertest.

## Test Structure

```
tests/
├── auth.test.js          # Authentication tests (register, login, token validation)
├── watchlist.test.js     # Watchlist CRUD operation tests
└── validation.test.js    # Input validation and sanitization tests
```

## Running Tests

### Install Test Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npx mocha tests/auth.test.js
npx mocha tests/watchlist.test.js
npx mocha tests/validation.test.js
```

## Test Coverage

### Authentication Tests (`auth.test.js`)

**User Registration:**
- ✅ Successful user registration
- ✅ Validation: Invalid email format
- ✅ Validation: Short password
- ✅ Validation: Duplicate user registration

**User Login:**
- ✅ Successful login with valid credentials
- ✅ Reject invalid email
- ✅ Reject wrong password

**Token Authentication:**
- ✅ Get user info with valid token
- ✅ Reject request without token
- ✅ Reject request with invalid token

### Watchlist Tests (`watchlist.test.js`)

**CRUD Operations:**
- ✅ Add movie to watchlist
- ✅ Prevent duplicate watchlist items
- ✅ Retrieve user watchlist
- ✅ Update watchlist item (mark as watched)
- ✅ Delete watchlist item
- ✅ Authentication required for all operations

### Validation Tests (`validation.test.js`)

**Registration Validation:**
- ✅ Empty username rejection
- ✅ Username length validation (3-30 characters)
- ✅ Invalid email format rejection
- ✅ Password length validation (minimum 6 characters)

**Login Validation:**
- ✅ Empty email rejection
- ✅ Invalid email format rejection
- ✅ Empty password rejection

**Watchlist Validation:**
- ✅ Required fields validation (movieId, title, type)

## Test Setup Requirements

1. **MongoDB Connection**: Tests require a MongoDB connection. You can use:
   - Local MongoDB instance
   - MongoDB Atlas (set `MONGODB_URI` in environment)
   - Test database (recommended)

2. **Environment Variables**: Create a `.env.test` file for test configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-recommendations-test
   JWT_SECRET=test-secret-key
   TMDB_API_KEY=test-api-key
   PORT=3001
   ```

3. **Test Database**: It's recommended to use a separate test database to avoid affecting development data.

## Writing New Tests

### Example Test Structure

```javascript
const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Feature Name', () => {
    // Setup (runs before all tests)
    before((done) => {
        // Setup code here
        done();
    });

    // Cleanup (runs after all tests)
    after((done) => {
        // Cleanup code here
        done();
    });

    describe('Test Group', () => {
        it('should do something', (done) => {
            request(app)
                .get('/api/endpoint')
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.property('data');
                })
                .end(done);
        });
    });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clean up test data after tests complete
3. **Descriptive Names**: Use descriptive test names that explain what is being tested
4. **Error Handling**: Test both success and failure cases
5. **Assertions**: Use specific assertions (e.g., `expect().to.equal()` instead of `expect().to.be.ok`)

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

- **GitHub Actions**: Add `.github/workflows/test.yml`
- **Travis CI**: Add `.travis.yml`
- **CircleCI**: Add `.circleci/config.yml`

## Future Test Improvements

- [ ] Add integration tests for recommendation engine
- [ ] Add performance/load testing
- [ ] Add end-to-end (E2E) tests
- [ ] Increase code coverage to 80%+
- [ ] Add API documentation tests
- [ ] Add database migration tests

