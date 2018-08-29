const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema and Model 

const RoutineSchema = new Schema({
    cycle: String,
    workout: String,
    sets: Number,
    reps: Number

});

const Routine = mongoose.model('routines', RoutineSchema);

module.exports = Routine;