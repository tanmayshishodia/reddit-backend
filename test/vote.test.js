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


describe("POST /votePosts/:id", () => {
    test("Upvote a post by an authenticated user", async () => {
      const upvote = await request(app)
        .post("/votePosts/604fa778019cb9437f82e8ef")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "actions": "increment"
        });
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /votePosts/:id", () => {
    test("Downvote a post by an authenticated user", async () => {
      const upvote = await request(app)
        .post("/votePosts/604fa778019cb9437f82e8ef")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "actions": "decrement"
        });
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /votecomments/:id", () => {
    test("Upvote a comment by an authenticated user", async () => {
      const upvote = await request(app)
        .post("/votecomments/605090c0545b921527db37c7/null")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "actions": "increment"
        });
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /votecomments/:id", () => {
    test("Downvote a comment by an authenticated user", async () => {
      const upvote = await request(app)
        .post("/votecomments/605090c0545b921527db37c7/null")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "actions": "decrement"
        });
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });
