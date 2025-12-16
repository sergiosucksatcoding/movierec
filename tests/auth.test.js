/**
 * Authentication API Tests
 * Tests for user registration, login, and authentication endpoints
 * 
 * Run tests with: npm test
 * 
 * @requires mocha - Test framework
 * @requires chai - Assertion library
 * @requires supertest - HTTP assertion library for testing API endpoints
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

// Test user data
const testUser = {
    username: 'testuser' + Date.now(), // Unique username
    email: 'test' + Date.now() + '@example.com', // Unique email
    password: 'testpassword123'
};

let authToken = '';

describe('Authentication API', () => {
    
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', (done) => {
            request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.have.property('username', testUser.username);
                    expect(res.body.user).to.have.property('email', testUser.email);
                    expect(res.body.user).to.not.have.property('password'); // Password should not be returned
                    authToken = res.body.token; // Store token for other tests
                })
                .end(done);
        });

        it('should reject registration with invalid email', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'invalid-email',
                    password: 'password123'
                })
                .expect(400)
                .end(done);
        });

        it('should reject registration with short password', (done) => {
            request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser3',
                    email: 'test3@example.com',
                    password: '12345' // Less than 6 characters
                })
                .expect(400)
                .end(done);
        });

        it('should reject duplicate user registration', (done) => {
            request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).to.include('already exists');
                })
                .end(done);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.email).to.equal(testUser.email);
                })
                .end(done);
        });

        it('should reject login with invalid email', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).to.include('Invalid credentials');
                })
                .end(done);
        });

        it('should reject login with wrong password', (done) => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).to.include('Invalid credentials');
                })
                .end(done);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return user info with valid token', (done) => {
            request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.property('username');
                    expect(res.body).to.have.property('email');
                    expect(res.body).to.not.have.property('password');
                })
                .end(done);
        });

        it('should reject request without token', (done) => {
            request(app)
                .get('/api/auth/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).to.include('authorization denied');
                })
                .end(done);
        });

        it('should reject request with invalid token', (done) => {
            request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401)
                .end(done);
        });
    });
});

