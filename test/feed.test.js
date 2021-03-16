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

describe("GET /feed", () => {
    test("It responds with feed data in json format", async (done) => {
        const response = await request(app).get("/feed").set('uid', '6045fd1e46373130ec9d2431');
        expect(response.body[0]).toHaveProperty("uid");
        expect(response.body[0]).toHaveProperty("caption");
        expect(response.body[0]).toHaveProperty("Etag");
        expect(response.body[0]).toHaveProperty("Location");
        expect(response.body[0]).toHaveProperty("key");
        expect(response.body[0]).toHaveProperty("bucket");
        expect(response.body[0]).toHaveProperty("filename");
        expect(response.body[0]).toHaveProperty("createdAt");
        expect(response.body[0]).toHaveProperty("test");
        expect(response.statusCode).toBe(200);
        done()
    });
});