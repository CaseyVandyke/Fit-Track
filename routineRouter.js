const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Routines} = require('./models');

Routines.create('biceps', 'curls', 4, 12, 'Casey Van Dyke');
Routines.create('shoulders', 'flies', 4, 12, 'Casey Van Dyke');
Routines.create('chest', 'bench press', 4, 12, 'Casey Van Dyke');

router.get('/', (req, res) => {
    res.json(Routines.get());
});

router.post('/', jsonParser,(req, res) => {
    const requiredFields = ['cycle', 'workout', 'sets', 'reps', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \'${field}\' in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
});

module.exports = router;