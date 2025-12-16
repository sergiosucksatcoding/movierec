/**
 * Watchlist API Tests
 * Tests for watchlist CRUD operations
 * 
 * @requires mocha - Test framework
 * @requires chai - Assertion library
 * @requires supertest - HTTP assertion library
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

// Test credentials (user must be registered first)
const testCredentials = {
    email: 'testwatchlist@example.com',
    password: 'testpassword123'
};

let authToken = '';
let userId = '';
let watchlistItemId = '';

describe('Watchlist API', () => {
    
    // Setup: Register and login user before tests
    before((done) => {
        request(app)
            .post('/api/auth/register')
            .send({
                username: 'watchlistuser',
                email: testCredentials.email,
                password: testCredentials.password
            })
            .end((err, res) => {
                if (err) return done(err);
                authToken = res.body.token;
                userId = res.body.user.id;
                done();
            });
    });

    describe('POST /api/watchlist', () => {
        it('should add a movie to watchlist', (done) => {
            const movieData = {
                movieId: 12345,
                title: 'Test Movie',
                posterPath: '/test-poster.jpg',
                overview: 'Test movie overview',
                releaseDate: '2024-01-01',
                type: 'movie'
            };

            request(app)
                .post('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .send(movieData)
                .expect(201)
                .expect((res) => {
                    expect(res.body).to.have.property('_id');
                    expect(res.body.title).to.equal(movieData.title);
                    expect(res.body.movieId).to.equal(movieData.movieId);
                    watchlistItemId = res.body._id;
                })
                .end(done);
        });

        it('should reject duplicate watchlist items', (done) => {
            const movieData = {
                movieId: 12345,
                title: 'Test Movie',
                type: 'movie'
            };

            request(app)
                .post('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .send(movieData)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).to.include('Already in watchlist');
                })
                .end(done);
        });

        it('should reject request without authentication', (done) => {
            request(app)
                .post('/api/watchlist')
                .send({ movieId: 999, title: 'Test', type: 'movie' })
                .expect(401)
                .end(done);
        });
    });

    describe('GET /api/watchlist', () => {
        it('should retrieve user watchlist', (done) => {
            request(app)
                .get('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.at.least(1);
                })
                .end(done);
        });

        it('should reject request without authentication', (done) => {
            request(app)
                .get('/api/watchlist')
                .expect(401)
                .end(done);
        });
    });

    describe('PUT /api/watchlist/:id', () => {
        it('should update watchlist item (mark as watched)', (done) => {
            request(app)
                .put(`/api/watchlist/${watchlistItemId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ watched: true })
                .expect(200)
                .expect((res) => {
                    expect(res.body.watched).to.be.true;
                })
                .end(done);
        });
    });

    describe('DELETE /api/watchlist/:id', () => {
        it('should delete watchlist item', (done) => {
            request(app)
                .delete(`/api/watchlist/${watchlistItemId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).to.include('Removed from watchlist');
                })
                .end(done);
        });

        it('should return 404 for non-existent item', (done) => {
            request(app)
                .delete(`/api/watchlist/${watchlistItemId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)
                .end(done);
        });
    });
});

