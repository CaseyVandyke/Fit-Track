'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require('./config');
const Routine = require('./models/routine-model')
mongoose.Promise = global.Promise;
const router = require('./routers/routineRouter')


app.use(bodyParser.json());

// initialize routes
app.use('/api', router);

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