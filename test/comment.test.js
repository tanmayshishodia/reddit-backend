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

var newCommentId;
var newReplyId;

const globalPostId = "60542a871a679200158d77c5"


// describe("GET /comments/:id", () => {
//     test("It responds with comments on a particular post and by which user", async (done) => {
//         const response = await request(app).get("/comments/604fa778019cb9437f82e8ef")
//         expect(response.body[0]).toHaveProperty("uid");
//         expect(response.body[0]).toHaveProperty("content");
//         expect(response.body[0]).toHaveProperty("votes");
//         expect(response.body[0]).toHaveProperty("postId");
//         expect(response.body[0]).toHaveProperty("parentId");
//         expect(response.body[0]).toHaveProperty("createdAt");
//         expect(response.statusCode).toBe(200);
//         done()
//     }, 50000);
// });

// describe("GET /reply/:id", () => {
//     test("It responds with replies on a particular comment and by which user", async (done) => {
//         const response = await request(app).get("/reply/605090c0545b921527db37c7")
//         expect(response.body[0]).toHaveProperty("uid");
//         expect(response.body[0]).toHaveProperty("content");
//         expect(response.body[0]).toHaveProperty("votes");
//         expect(response.body[0]).toHaveProperty("postId");
//         expect(response.body[0]).toHaveProperty("parentId");
//         expect(response.body[0]).toHaveProperty("createdAt");
//         expect(response.statusCode).toBe(200);
//         done()
//     }, 30000);
// });

// describe("GET /reply/:id", () => {
//   test("It responds with replies on a particular comment and by which user", async (done) => {
//       const response = await request(app).get("/reply/605090c0545b921527db37c7").set('uid', '"6045fd1e46373130ec9d2431"')
//       expect(response.body[0]).toHaveProperty("uid");
//       expect(response.body[0]).toHaveProperty("content");
//       expect(response.body[0]).toHaveProperty("votes");
//       expect(response.body[0]).toHaveProperty("postId");
//       expect(response.body[0]).toHaveProperty("parentId");
//       expect(response.body[0]).toHaveProperty("createdAt");
//       expect(response.statusCode).toBe(200);
//       done()
//   }, 30000);
// });

// ---------------------------------------------

describe("POST /comment", () => {
    test("It responds with the newly created comment to a post", async () => {
      const newComment = await request(app)
        .post("/comment")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
          "content": "hello",
          "id": `${globalPostId}`,
          "pid": "null"
        });
      newCommentId = newComment.body._id
      console.log("id--->", newCommentId)
      expect(newComment.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /comment", () => {
    test("It responds with the newly created reply to commment on a post", async () => {
      const newComment = await request(app)
        .post("/comment")
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
          "content": "hello reply",
          "id": `${globalPostId}`,
          "pid": `${newCommentId}`
        });
      newReplyId = JSON.parse(newComment.text)._id
      expect(newComment.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /vote/:id", () => {
    test("Upvote a comment", async () => {
      const upvote = await request(app)
        .post(`/comment/vote/${newCommentId}`)
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
          actions: "increment"
        });
      expect(upvote.statusCode).toBe(200);
    }, 30000);
  });

  describe("POST /vote/:id", () => {
    test("Downvote a comment", async () => {
      const Downvote = await request(app)
        .post(`/comment/vote/${newCommentId}`)
        .set('uid', '"604fa60313489641f90db5ad"')
        .send({
          actions: "decrement"
        });
      expect(Downvote.statusCode).toBe(200);
    }, 30000);
  });

  describe("GET /comment/:id", () => {
    test("It responds with comment", async (done) => {
        const response = await request(app).get(`/comment/${globalPostId}`)
        expect(response.statusCode).toBe(200);
        done()
    }, 50000);
});

describe("GET /comment/:id/:pid", () => {
  test("It responds with comment", async (done) => {
      const response = await request(app).get(`/comment/${globalPostId}/${newCommentId}`)
      expect(response.statusCode).toBe(200);
      done()
  }, 50000);
});

describe("PUT /comment/:id", () => {
  test("Edit a comment owned by an authenticated user", async () => {
      const upload = await request(app)
          .put(`/comment/${newCommentId}`)
          .set('uid', '"604fa60313489641f90db5ad"')
          .send({
              "content": "hello"
          });
      expect(upload.statusCode).toBe(200);
  }, 30000);
});

describe("DELETE /comment/:id", () => {
  test("Delete a comment owned by an authenticated user", async () => {
      const upload = await request(app)
          .delete(`/comment/${newCommentId}`)
          .set('uid', '"604fa60313489641f90db5ad"')
      expect(upload.statusCode).toBe(200);
  }, 30000);
});

describe("DELETE /comment/:id", () => {
  test("Delete a reply owned by an authenticated user", async () => {
      const upload = await request(app)
          .delete(`/comment/${newReplyId}`)
          .set('uid', '"604fa60313489641f90db5ad"')
      expect(upload.statusCode).toBe(200);
  }, 30000);
});