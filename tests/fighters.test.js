const request = require('supertest');
const { expect } = require('chai');
const app = 'http://localhost:3000';
const { testFighter } = require('./testData');


describe('Fighters Management Tests', function() {
  let fighterId;
  
  before(async function() {
    const res = await request(app)
        .post('/api/users/login')
        .send({
            email: 'admin@test.com',
            password: 'password123'
        })
    
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token')
    authToken = res.body.token
  });
  
  it('should create a new fighter', async function() {
    const res = await request(app)
      .post('/api/fighters')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testFighter);
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('name', testFighter.name);
  });
  
  it('should fail to create a fighter with missing required fields', async function() {
    const res = await request(app)
      .post('/api/fighters')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Incomplete Fighter'
      });
    
    expect(res.status).to.equal(400);
  });
  
  it('should list all fighters', async function() {
    const res = await request(app)
      .get('/api/fighters')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.length).to.be.at.least(1);
  });
  
  it('should fail to delete non-existent fighter', async function() {
    const res = await request(app)
      .delete(`/api/fighters/99999`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).to.equal(404);
  });
});
