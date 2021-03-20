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
var newPostId;

describe("GET /post", () => {
    test("It responds with feed data in json format", async (done) => {
        const response = await request(app).get("/post").set('uid', '"6045fd1e46373130ec9d2431"');
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("caption");
        expect(response.body[0]).toHaveProperty("createdAt");
        expect(response.body[0]).toHaveProperty("test");
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("GET /post", () => {
    test("It responds with feed data in json format", async (done) => {
        const response = await request(app).get("/post")
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("caption");
        expect(response.body[0]).toHaveProperty("createdAt");
        expect(response.body[0]).toHaveProperty("test");
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("POST /post", () => {
    test("Create a post by an authenticated user", async () => {
        const upload = await request(app)
            .post("/post")
            .set('uid', '"604fa60313489641f90db5ad"')
            .send({
                "caption": "test"
            });
        newPostId = JSON.parse(upload.text)._id
        expect(upload.statusCode).toBe(200);
    }, 30000);
});

describe("GET /post/:id", () => {
    test("It responds with single post in json format (authenticated user)", async (done) => {
        const response = await request(app).get(`/post/${newPostId}`).set('uid', '"604fa60313489641f90db5ad"');
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("GET /post/:id", () => {
    test("It responds with single post in json format", async (done) => {
        const response = await request(app).get(`/post/${newPostId}`)
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("GET /post/state", () => {
    test("It responds with state of posts for different users in json format", async (done) => {
        const response = await request(app).get("/post/state").set('uid', '"604fa60313489641f90db5ad"');
        // expect(response.body[0]).toHaveProperty("uid");
        // expect(response.body[0]).toHaveProperty("postId");
        // expect(response.body[0]).toHaveProperty("state");
        expect(response.statusCode).toBe(200);
        done()
    }, 30000);
});

describe("PUT /post/:id", () => {
    test("Edit a post owned by an authenticated user", async () => {
        const upload = await request(app)
            .put(`/post/${newPostId}`)
            .set('uid', '"604fa60313489641f90db5ad"')
            .send({
                "caption": "hello"
            });
        expect(upload.statusCode).toBe(200);
    }, 30000);
});

describe("POST /post/vote/:id", () => {
    test("Upvote a post by an authenticated user", async () => {
        const upvote = await request(app)
            .post(`/post/vote/${newPostId}`)
            .set('uid', '"604fa60313489641f90db5ad"')
            .send({
                "actions": "increment"
            });
        expect(upvote.statusCode).toBe(200);
    }, 30000);
});

describe("POST /votePosts/:id", () => {
    test("Downvote a post by an authenticated user", async () => {
        const downvote = await request(app)
            .post(`/post/vote/${newPostId}`)
            .set('uid', '"604fa60313489641f90db5ad"')
            .send({
                "actions": "decrement"
            });
        expect(downvote.statusCode).toBe(200);
    }, 30000);
});



describe("DELETE /post/:id", () => {
    test("Delete a post owned by an authenticated user", async () => {
        const upload = await request(app)
            .delete(`/post/${newPostId}`)
            .set('uid', '"604fa60313489641f90db5ad"')
        expect(upload.statusCode).toBe(200);
    }, 30000);
});