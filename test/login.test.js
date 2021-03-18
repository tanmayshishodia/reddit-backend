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


describe("POST /register", () => {
    test("Register user after login for first time", async () => {
        const register = await request(app)
            .post("/register")
            .set('uid', '"6045fd1e46373130ec9d2431"')
            .send({
                username: "tanmayshishodia",
                dob: "1998-12-15"
            });
        expect(register.statusCode).toBe(404); //this user already exists so
    }, 30000);
});

