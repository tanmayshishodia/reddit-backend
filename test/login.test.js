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

describe("POST /login", () => {
    test("Login and check if user already exists", async () => {
        const login = await request(app)
            .post("/login")
            .send({
                "profileObj": {
                    "googleId": "106979302037111006753",
                    "displayName": "Aayush Roy",
                    "firstName": "Aayush",
                    "lastName": "Roy",
                    "image": "https://lh3.googleusercontent.com/a-/AOh14Ghu5VLu_sR6oWzLJdaELyJBVcGtU...",
                    "email": "roy.a2yush@gmail.com"
                }
            });
        
        expect(login.statusCode).toBe(200);
    }, 30000);
});