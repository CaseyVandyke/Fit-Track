'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        unique: true
    }
});



const commentSchema = mongoose.Schema({
    comment: String
});
*/

const dietSchema = mongoose.Schema({
    title: String,
    calories: Number,
    img: {
        type: String,
        required: false
    },
    recipe: [String],
    notes: String

    //??? catches comment from author?

    /* author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    comments: [commentSchema]
    */
});
/*
dietSchema.pre('find', (next) => {
    this.populate('author');
    next();
});

dietSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
  });

dietSchema.virtual('authorName').get(function () {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

dietSchema.methods.serialize = function () {
    return {
        id: this._id,
        author: this.authorName,
        calories: this.calories,
        recipe: this.recipe,
        notes: this.notes
    };
};


const Author = mongoose.model('Author', authorSchema);
*/
const Diet = mongoose.model('diets', dietSchema);




module.exports = { Diet };