require('dotenv/config')
const dotenv = require('dotenv')
const connectDB = require('../config/db')
const testUser = require('../testModels/testUser')
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app= require("../app");
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' })

connectDB()

afterAll(async () => {
  await mongoose.connection.close()
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
// testUser.create({
//     "karma": 1,
//     "badge": 0,
//     "googleId": "114770881457064547165",
//     "displayName": "Tanmay Shishodia",
//     "firstName": "Tanmay",
//     "lastName": "Shishodia",
//     "image": "https://lh3.googleusercontent.com/a-/AOh14Ggsfm1pYK29xl1ntXqY_EppftSoR3y_jib1VjRvYXM=s96-c",
//     "createdAt": "2021-03-08T10:31:58.745Z",
//     "__v": 0,
//     "dob": "1998-12-15",
//     "username": "tanmayshishodia"
//   })

describe("GET /profile", () => {
  test("It responds with profile data in json format", async (done) => {
    const response = await request(app).get("/profile").set('uid', '6045fd1e46373130ec9d2431');
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("googleId");
    expect(response.body[0]).toHaveProperty("displayName");
    expect(response.body[0]).toHaveProperty("firstName");
    expect(response.body[0]).toHaveProperty("lastName");
    expect(response.body[0]).toHaveProperty("image");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("dob");
    expect(response.body[0]).toHaveProperty("username");
    expect(response.body[0]).toHaveProperty("karma");
    expect(response.body[0]).toHaveProperty("badge");
    expect(response.statusCode).toBe(200);
    done()
  });
});


