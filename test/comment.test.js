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

describe("GET /comments/:id", () => {
    test("It responds with comments on a particular post and by which user", async (done) => {
        const response = await request(app).get("/comments/604fa778019cb9437f82e8ef")
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("content");
        expect(response.body[0]).toHaveProperty("votes");
        expect(response.body[0]).toHaveProperty("postId");
        expect(response.body[0]).toHaveProperty("parentId");
        expect(response.body[0]).toHaveProperty("createdAt");
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("GET /reply/:id", () => {
    test("It responds with replies on a particular comment and by which user", async (done) => {
        const response = await request(app).get("/reply/605090c0545b921527db37c7")
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("content");
        expect(response.body[0]).toHaveProperty("votes");
        expect(response.body[0]).toHaveProperty("postId");
        expect(response.body[0]).toHaveProperty("parentId");
        expect(response.body[0]).toHaveProperty("createdAt");
        expect(response.statusCode).toBe(200);
        done()
    });
});


describe("POST /postComments/:id/:pid", () => {
    test("It responds with the newly created comment to a post or reply to commment", async () => {
      const newComment = await request(app)
        .post("/postComments/604fa778019cb9437f82e8ef/null")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
          content: "Hello"
        });

      expect(newComment.body).toHaveProperty("uid");
      expect(newComment.body).toHaveProperty("postId");
      expect(newComment.body).toHaveProperty("votes");
      expect(newComment.body).toHaveProperty("parentId");

      expect(newComment.statusCode).toBe(200);
    });
  });

