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

describe("GET /poststate", () => {
    test("It responds with state of posts for different users in json format", async (done) => {
        const response = await request(app).get("/poststate").set('uid', '"604fa60313489641f90db5ad"');
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("postId");
        expect(response.body[0]).toHaveProperty("state");
        expect(response.statusCode).toBe(200);
        done()
    });
});