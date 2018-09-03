
const express = require('express');
const morgan = require('morgan');

const routineRouter = require('./routineRouter');

const app = express();

app.use(morgan('common'));
app.use('/routines', routineRouter);
app.use(express.static('public'));

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });