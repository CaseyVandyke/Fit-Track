'use strict';

const mongoose = require('mongoose');
const User = require('./users-model');
mongoose.Promise = global.Promise;



const dietSchema = mongoose.Schema({
    title: String,
    calories: String,
    img: {
        type: String,
        required: false
    },
    recipe: [String],
    notes: String,
    author: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'users'
    }
    
});

const Diet = mongoose.model('diets', dietSchema);




module.exports =  Diet;