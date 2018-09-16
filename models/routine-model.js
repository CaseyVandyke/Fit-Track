'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({ comment: String});
//Creat routine Schema and model

const routineSchema = mongoose.Schema({
    targetMuscle: {
        type: String,
        required: [true, 'Target muscle field is required']
    },
    workout: {
        type: String,
        required: [true, 'Workout field is required']
    },
    sets: {
        type: Number,
        required: [true, 'Sets field is required']
    },
    reps: {
        type: Number,
        required: [true, 'Repetiotions field is required']
    }

});

const Routine = mongoose.model('routines', routineSchema);

module.exports = Routine;