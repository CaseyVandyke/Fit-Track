'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// this makes the should syntax available throughout
// this module
const should = require('chai').should();
const expect = chai.expect;

const Routine = require('../models/routine-model');
const User = require('../models/users-model');

const {
    closeServer,
    runServer,
    app
} = require('../server');

const {
    TEST_DATABASE_URL,
    JWT_SECRET
} = require('../config');

chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}




const username = faker.internet.userName();
const password = faker.internet.password();

describe('Routine API resource', function () {

    before(function () {
          runServer(TEST_DATABASE_URL);
           return User.hashPassword(password).then(password => {
            
            User.create({username, password}).then(userData => {
                let newRoutine = {
                    targetMuscle: faker.lorem.text(),
                    workout: faker.lorem.text(),
                    sets: faker.random.number(),
                    reps: faker.random.number(),
                    img: faker.image.image(),
                    author: userData.username
                };
                Routine.create(newRoutine);
            })
        })
         
    });

    beforeEach(function () {
        
    });

    afterEach(function () {
        // tear down database so we ensure no state from this test
        // effects any coming after.
        //return tearDownDb();
    });

    after(function () {
        tearDownDb();
        return closeServer();
    });


    
    it('should return routines with right fields', function () {
        // Strategy: Get back all routines, and ensure they have expected keys

        let resRoutine;
        var token = jwt.sign({
                
                        username,
                        password
                    
            }, 
            JWT_SECRET, 
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            });
            
            User.find({"username" : username})
            .then((users) => {
            return chai.request(app)
                .get('/api/routines')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .then(function (res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.at.least(1);
                    res.body.forEach(function (routinePost) {
                        routinePost.should.be.a('object');
                        routinePost.should.include.keys('targetMuscle', 'workout', 'sets', 'reps', 'author');
                    });
                    // just check one of the posts that its values match with those in db
                    // and we'll assume it's true for rest
                    resRoutine = res.body[0];
                    Routine.findById(resRoutine._id);
                })
                .then(routine => {
                    routine.targetMuscle.should.not.equal(null);
                    routine.workout.should.not.equal(null);
                    routine.sets.should.not.equal(null);
                    routine.reps.should.not.equal(null);
                    routine.author.should.not.equal(null);
                });
            });
    });
});