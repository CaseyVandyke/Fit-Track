"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");
const assert = require("assert");
const expect = chai.expect;

chai.use(chaiHttp);

//Describe tests

describe("index page", function() {
  it("should exist", function() {
    assert(2+4 === 6);
      });
  });