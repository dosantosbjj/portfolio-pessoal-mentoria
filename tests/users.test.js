const request = require("supertest");
const { expect } = require("chai");
const app = "http://localhost:3000";

describe("User Management Tests", function () {
  let userId;
  let token;

  before(async function () {
    const res = await request(app).post("/api/users/login").send({
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    token = res.body.token;
  });

  it("should search for user by email", async function () {
    const res = await request(app)
      .get(`/api/users/search?email=admin@test.com`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("email", 'admin@test.com');
  });

  it("should search for user by CPF", async function () {
    const res = await request(app)
      .get(`/api/users/search?cpf=00000000000`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("cpf", '00000000000');
  });
});
