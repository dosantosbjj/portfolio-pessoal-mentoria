const request = require('supertest')
const { expect } = require('chai')
const app = 'http://localhost:3000'
const { generateRandomUser } = require('./testData')

describe('Authentication Tests', function() {
  let authToken
  let testUser
  
  before(function() {
    testUser = generateRandomUser()
    global.testUser = testUser 
  })
  
  it('should register a new user with random data', async function() {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser)
    
    expect(res.status).to.equal(201)
  })
  
  it('should login with the newly created user credentials', async function() {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
    
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token')
    authToken = res.body.token
  })
  
  it('should reject login with invalid credentials', async function() {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
    
    expect(res.status).to.equal(401)
  })
})
