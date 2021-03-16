require('dotenv/config')
const dotenv = require('dotenv')
const connectDB = require('../config/db')
const testUser = require('../testModels/testUser')
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app= require("../app");
const mongoose = require('mongoose');
const http = require('http');
const express = require('express')
dotenv.config({ path: './config/config.env' })

connectDB()


describe("GET /profile", () => {
  test("It responds with profile data in json format", async (done) => {
    const response = await request(app).get("/profile").set('uid', '6045fd1e46373130ec9d2431');
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("googleId");
    expect(response.body[0]).toHaveProperty("displayName");
    expect(response.body[0]).toHaveProperty("firstName");
    expect(response.body[0]).toHaveProperty("lastName");
    expect(response.body[0]).toHaveProperty("image");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("dob");
    expect(response.body[0]).toHaveProperty("username");
    expect(response.body[0]).toHaveProperty("karma");
    expect(response.body[0]).toHaveProperty("badge");
    expect(response.statusCode).toBe(200);
    done()
  });
});


