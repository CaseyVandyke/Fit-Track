const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Routines} = require('./models');

Routines.create('biceps', 'curls', 4, 12, 'Casey Van Dyke');
Routines.create('shoulders', 'flies', 4, 12, 'Casey Van Dyke');
Routines.create('chest', 'bench press', 4, 12, 'Casey Van Dyke');

