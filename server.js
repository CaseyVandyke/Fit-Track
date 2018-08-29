"use strict";

const express = require("express");
const morgan = require('morgan');
const app = express();

const routineRouter = require('./routineRouter')

app.use(express.static("public"));

app.use('../model/routines', routineRouter);

//log the http layer
app.use(morgan('common'));

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;