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
    test("Increment a post by an authenticated user", async () => {
      const upvote = await request(app)
        .post("/votePosts/604fa778019cb9437f82e8ef")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
            "actions": "increment"
        });
  
    //   expect(upvote.body).toHaveProperty("uid");
    //   expect(upvote.body).toHaveProperty("postId");
    //   expect(upvote.body).toHaveProperty("votes");
    //   expect(upvote.body).toHaveProperty("parentId");
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });
