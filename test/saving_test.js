"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");
const assert = require("assert");
const expect = chai.expect;
const Routine = require('../models/routines');

chai.use(chaiHttp);

//Describe tests

describe("Saving records", function (done) {

  // Create tests
  it("Saves a record to the database", function () {
    const newRoutine = new Routine({
      cycle: 'Biceps and Back',
      workout: 'Curls',
      sets: 4,
      reps: 12
    })

  newRoutine.save().then(function(){
    assert(newRoutine.isNew === false);
    done();
  })
  });
});

