const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {RoutineSchema} = require('./routines');

RoutineSchema.create(
    'Biceps', 'Curls', 4, 12
);
RoutineSchema.create(
    'Chest', 'Bench press', 4, 12
);
router.get('/', (req, res) => {
    res.json(RoutineSchema.get());
});
