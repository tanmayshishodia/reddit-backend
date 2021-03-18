require('dotenv/config')
const dotenv = require('dotenv')
const connectDB = require('../config/db')
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../app");
dotenv.config({
    path: './config/config.env'
})

connectDB()

describe("GET /post/:id", () => {
    test("It responds with single post in json format", async (done) => {
        const response = await request(app).get("/post/604fa778019cb9437f82e8ef").set('uid', '"604fa60313489641f90db5ad"');
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("GET /poststate", () => {
    test("It responds with state of posts for different users in json format", async (done) => {
        const response = await request(app).get("/poststate").set('uid', '"604fa60313489641f90db5ad"');
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("postId");
        expect(response.body[0]).toHaveProperty("state");
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("POST /upload", () => {
    test("Create a post by an authenticated user", async () => {
      const upload = await request(app)
        .post("/upload")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "caption": "test"
        });
      expect(upload.statusCode).toBe(200);
    }, 30000);
  });