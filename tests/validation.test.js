/**
 * Input Validation Tests
 * Tests to ensure all user inputs are properly validated and sanitized
 * 
 * @requires mocha - Test framework
 * @requires chai - Assertion library
 * @requires supertest - HTTP assertion library
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Input Validation', () => {
    
    describe('User Registration Validation', () => {
        it('should reject empty username', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: '',
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject username shorter than 3 characters', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'ab',
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject username longer than 30 characters', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'a'.repeat(31),
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject invalid email format', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'not-an-email',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject password shorter than 6 characters', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: '12345'
                })
                .expect(400)
                .end(done);
        });
    });

    describe('User Login Validation', () => {
        it('should reject empty email', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: '',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject invalid email format', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject empty password', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: ''
                })
                .expect(400)
                .end(done);
        });
    });

    describe('Watchlist Input Validation', () => {
        let authToken = '';

        before((done) => {
            // Create a test user for watchlist tests
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'validationuser' + Date.now(),
                    email: 'validation' + Date.now() + '@example.com',
                    password: 'password123'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    authToken = res.body.token;
                    done();
                });
        });

        it('should require movieId when adding to watchlist', (done) => {
            request(app)
                .post('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Movie',
                    type: 'movie'
                })
                .expect(400)
                .end(done);
        });

        it('should require title when adding to watchlist', (done) => {
            request(app)
                .post('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    movieId: 123,
                    type: 'movie'
                })
                .expect(400)
                .end(done);
        });

        it('should require type when adding to watchlist', (done) => {
            request(app)
                .post('/api/watchlist')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    movieId: 123,
                    title: 'Test Movie'
                })
                .expect(400)
                .end(done);
        });
    });
});

