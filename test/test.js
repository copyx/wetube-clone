import request from "supertest";
import app from "../src/app";

it("HTTP Test", function (done) {
  request(app).get("/").expect(200, done);
});
