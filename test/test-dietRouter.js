'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const faker = require('faker');
const Diet = require('../models/diets-model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    TEST_DATABASE_URL, JWT_SECRET
} = require('../config');


chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
function seedDiettData() {
    console.info('seeding diet data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateDietData());
    }
    //this will return a promise
    return Diet.insertMany(seedData);

}

function generateDiettData() {
    return {
        title: faker.lorem.word(),
        calories: faker.lorem.word(),
        img: faker.image.food(),
        recipe: faker.lorem.word(),
        notes: faker.lorem.words(),
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

function generateUserData() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

describe('Diet', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    before(function() {
        return seedDiettData();
    })

    after(function () {
        return closeServer();
    });

    it('should list diets on GET', function () {
        return chai.request(app)
            .get('/api/diets')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a(('object'))
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys(
                        'title', 'calories', 'recipe', 'notes', 'author');
            });
        });
    });
});

describe('diet POST request', function() {
    it('should make a diet post', function() {
        const newDiet = generateDiettData();
        let user = generateUserData();
        let token = jwt.sign({ user }, JWT_SECRET)

        return chai.request(app)
        .post('/api/diets')
        .set('Cookie', `Token=${token}`)
        .send(newDiet)
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.title).to.deep.equal(newDiet.title);
            expect(res.body.calories).to.deep.equal(newDiet.calories);
            expect(res.body.img).to.deep.equal(newDiet.img);
            expect(res.body.recipe).to.deep.equal(newDiet.recipe);
            expect(res.body.notes).to.deep.equal(newDiet.notes);
        });
    });
});