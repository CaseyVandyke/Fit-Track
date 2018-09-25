'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const Diet = require('../models/diets-model');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

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
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedDietData() {
  console.info('seeding diet data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
        title: faker.lorem.text(),
        calories: faker.lorem.text(),
        img: faker.image.image(),
        recipe: faker.lorem.text(),
        notes: faker.lorem.text(),
        author: faker.lorem.text()

    });
  }
  // this will return a promise
  return Diet.insertMany(seedData);
}


describe('Diet API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedDietData();
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

    it('should return all existing diets', function () {
      // strategy:
      //    1. get back all posts returned by by GET request to `/posts`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/api/diets')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.should.have.lengthOf.at.least(1);

          return Diet.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          res.body.should.have.lengthOf(count);
        });
    });
});

    
    it('should return diets with right fields', function () {
      // Strategy: Get back all diets, and ensure they have expected keys

      let resDiet;
      return chai.request(app)
        .get('/api/diets')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);
          res.body.forEach(function (dietPost) {
          dietPost.should.be.a('object');
          dietPost.should.include.keys('title', 'calories', 'recipe', 'notes');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resDiet = res.body[0];
          return Diet.findById(resDiet._id);
        })
        .then(diet => {
            diet.title.should.not.equal(null);
            diet.calories.should.not.equal(null);
            diet.recipe.should.not.equal(null);
            diet.notes.should.not.equal(null);
            diet.author.should.not.equal(null);
        });
    });
  
  
  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new diet', function () {

      const newDiet = {
        title: faker.lorem.text(),
        calories: faker.lorem.text(),
        img: faker.image.image(),
        recipe: faker.lorem.text(),
        notes: faker.lorem.text(),
        author: faker.lorem.text()
      };

      return chai.request(app)
        .post('/api/diets')
        .send(newDiet)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          console.log(res.body);
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'title', 'calories', 'recipe', 'notes');
          res.body.title.should.equal(newDiet.title);
          // cause Mongo should have created id on insertion
          res.body._id.should.not.equal(null);
          return Diet.findById(res.body._id);
        })
        .then(diet => {
          diet.title.should.not.equal(null);
          diet.calories.should.not.equal(null);
          diet.recipe.should.not.equal(null);
          diet.notes.should.not.equal(null);
        });
    });
  });

  describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing diet from db
    //  2. Make a PUT request to update that diet
    //  4. Prove diet in db is correctly updated
    it('should update fields you send over', function () {
      const updateDiet = {
        title: 'Protein Brownie',
        calories: '300',
        recipe: ['1/2 cup chocolate protein', 'brownie mix'],
        notes: 'mix well'
      }

      

      return Diet
        .findOne()
        .then(diet => {
          updateDiet._id = diet._id;

          return chai.request(app)
            .put(`/api/diets${diet._id}`)
            .send(updateDiet);
        })
        .then(res => {
          res.should.have.status(204);
          return Diet.findById(updateDiet._id);
        })
        .then(diet => {
          diet.title.should.not.equal(null);
          diet.calories.should.not.equal(null);
          diet.recipe.should.not.equal(null);
          diet.notes.should.not.equal(null);
          
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a diet
    //  2. make a DELETE request for that diet's id
    //  3. assert that response has right status code
    //  4. prove that diet with the id doesn't exist in db anymore
    it('should delete a diet by id', function () {

      let diet;

      return Diet
        .findOne()
        .then(_diet => {
          diet = _diet;
          return chai.request(app).delete(`/api/diets${diet._id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Diet.findById(diet._id);
        })
        .then(_diet => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_diet.should.be.null` would raise
          // an error. `should.be.null(_diet)` is how we can
          // make assertions about a null value.
          should.not.exist(_diet);
        });
    });
});
});