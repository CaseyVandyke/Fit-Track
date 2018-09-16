'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true
    }
});

const commentSchema = mongoose.Schema({ comment: String});

const dietSchema = mongoose.Schema({
    title: String,
    calories: Number,
    img: {
        type: String,
        required: false
    },
    recipe: [String],
    notes: String,

    //???
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [commentSchema]

});

const Author = mongoose.model('Author', authorSchema);
const Diet = mongoose.model('diets', dietSchema);

// ????

Author
  .create({
    "firstName": "Michael",
    "lastName": "Jones",
    "userName": "micheal.jones"
  })
  .then(author => {
    Diet
      .create({
        title: "another title",
        calories: "200",
        img: {
            type: String,
            required: false
        },
        recipe: "Tofu ravioli",
        notes: "make sure to boil for 20 minutes until noodles are softened",
        author: author._id
      });
  });


module.exports =  Diet, Author;