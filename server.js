'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require('./config');
const User = require('./models/users-model');
const Routine = require('./models/routine-model');
const Diet = require('./models/diets-model');
mongoose.Promise = global.Promise;
const { router: userRouter } = require('./routers/userRouter');
const { router: routineRouter } = require('./routers/routineRouter');
const { router: dietRouter } = require('./routers/dietRouter');

app.use(express.static('public'));

app.use(bodyParser.json());

// initialize routes
app.use('/api', userRouter);
app.use('/api', routineRouter);
app.use('/api', dietRouter);

//error handling middleware
app.use((err,req,res,next) => {
    // console.log(err);
    res.status(422).send({error: err.message});
})

let server;
// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
          if (err) {
              return reject(err);
          }
          server = app.listen(port, () => {
                  console.log(`Your app is listening on port ${port}`);
                  resolve();
              })
              .on('error', err => {
                  mongoose.disconnect();
                  reject(err);
              });
      });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
          console.log('Closing server');
          server.close(err => {
              if (err) {
                  return reject(err);
              }
              resolve();
          });
      });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };