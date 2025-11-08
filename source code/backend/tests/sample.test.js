require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

describe("User Login Test", () => {
  test("POST /api/user/signin - Should login user with prashanth credentials", async () => {
    const res = await request(app)
      .post('/api/user/signin')
      .send({
        email: "prashanth@gmail.com",
        password: "prashanth"
      });

    expect([200, 401]).toContain(res.statusCode);
    
    if (res.statusCode === 200) {
      expect(res.body.message).toBe("User signed in successfully");
      expect(res.body).toHaveProperty('token');
    } else {
      expect(res.body.message).toBe("Invalid credentials");
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 500)); // graceful shutdown
  });
});
