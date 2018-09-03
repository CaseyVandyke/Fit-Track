
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routineRouter = require('./routineRouter');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

app.use('/routines', routineRouter);


app.use(express.static('public'));
app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });