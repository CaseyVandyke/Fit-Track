'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = require('chai').should();
const expect = chai.expect;

const Routine = require('../models/routine-model');
const {
    closeServer,
    runServer,
    app
} = require('../server');
const {
    TEST_DATABASE_URL
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


// used to put randomish documents in db
// so we have data to work with and assert about.
function seedRoutineData() {
    console.info('seeding routine data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            targetMuscle: faker.lorem.text(),
            workout: faker.lorem.text(),
            sets: faker.random.number(),
            reps: faker.random.number(),
            img: faker.image.image(),
            author: faker.lorem.text()

        });
    }
    // this will return a promise
    return Routine.insertMany(seedData);
}


describe('Routine API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedRoutineData();
    });

    afterEach(function () {
        // tear down database so we ensure no state from this test
        // effects any coming after.
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    // note the use of nested `describe` blocks.
    // this allows us to make clearer, more discrete tests that focus
    // on proving something small
    describe('GET endpoint', function () {

        it('should return all existing routines', function () {
            // strategy:
            //    1. get back all routines returned by by GET request to `/routines`
            //    2. prove res has right status, data type
            //    3. prove the number of routines we got back is equal to number
            //       in db.
            let res;
            return chai.request(app)
                .get('/api/routines')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    // otherwise our db seeding didn't work
                    res.body.should.have.lengthOf.at.least(1);

                    return Routine.count();
                })
                .then(count => {
                    // the number of returned posts should be same
                    // as number of posts in DB
                    res.body.should.have.lengthOf(count);
                });
        });
    });

    it('should return routines with right fields', function () {
        // Strategy: Get back all diets, and ensure they have expected keys

        let resRoutine;
        return chai.request(app)
            .get('/api/routines')
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
                return Routine.findById(resRoutine._id);
            })
            .then(routine => {
                routine.targetMuscle.should.not.equal(null);
                routine.workout.should.not.equal(null);
                routine.sets.should.not.equal(null);
                routine.reps.should.not.equal(null);
                routine.author.should.not.equal(null);
            });
    });

    describe('POST endpoint', function () {
        // strategy: make a POST request with data,
        // then prove that the post we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)
        it('should add a new routine', function () {

            const newRoutine = {
                targetMuscle: faker.lorem.text(),
                workout: faker.lorem.text(),
                sets: faker.random.number(),
                reps: faker.random.number(),
                img: faker.image.image(),
                author: faker.lorem.text()
            }
            return chai.request(app)
                .post('/api/routines')
                .send(newRoutine)
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    console.log(res.body);
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'targetMuscle', 'workout', 'sets', 'reps');
                    res.body.targetMuscle.should.equal(newRoutine.targetMuscle);
                    // cause Mongo should have created id on insertion
                    res.body._id.should.not.equal(null);
                    return Routine.findById(res.body._id);
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

    describe('diarypost PUT request', function () {
        it('should update fields sent', function () {
            const updateRoutine = {
                targetMuscle: faker.lorem.text(),
                workout: faker.lorem.text(),
                sets: faker.random.number(),
                reps: faker.random.number(),
                img: faker.image.image(),
                author: faker.lorem.text()
            }


            return Routine
                .findOne()
                .then(entry => {
                    updateRoutine.id = entry.id;
                    return chai.request(app)
                        .put(`/api/diets/${entry.id}`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send(updateRoutine);
                })
                .then(function (res) {
                    expect(res).to.have.status(200);

                    return Routine.findById(updateRoutine.id);
                })
                .then(routine => {
                    routine.targetMuscle.should.not.equal(null);
                    routine.workout.should.not.equal(null);
                    routine.sets.should.not.equal(null);
                    routine.reps.should.not.equal(null);
                    routine.author.should.not.equal(null);
                })
        });
    });


    //works
    describe('Diet DELETE endpoint', function () {
        it('should delete a diet by id', function () {
            let deletedRoutine;

            return Routine
                .findOne()
                .then(_post => {
                    deletedRoutine = _post;
                    return chai.request(app)
                        .delete(`/api/routines/${deletedRoutine._id}`)
                })
                .then(res => {
                    res.should.have.status(200);
                    return Routine.findById(deletedRoutine._id);
                })
                .then(post => {
                    should.not.exist(post);
                });
        });
    });
});