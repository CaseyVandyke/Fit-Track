"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../server.js");
chai.use(chaiHttp);

describe("index page", function() {
  it("should exist", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});