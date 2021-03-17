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
    });
});