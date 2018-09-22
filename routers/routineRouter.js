'use strict'

const express = require('express');
const router = express.Router();
const Routine = require('../models/routine-model')
const jwt = require('jsonwebtoken');
const User = require('../models/users-model');


router.get('/routines/:id', (req, res, next) => {
  Routine.find({
      'author': req.params.id
  }, (err, routine) => {
      if (err) {
          console.error(err)
          res.status(500).json({
              error: 'something went wrong'
          });
      } else {
          res.send(routine)
      }
  })
});
//Get all routines from the database
router.get('/routines', (req,res, next) => {
  Routine.find({})
  .then((routine) => {
    res.send(routine);
  })
  .catch(function(err){
    console.error(err);
    res.status(500).json({
      error: 'something went wrong'
    });
  })
});

// Add a new routine in the databse
router.post('/routines', (req,res, next) => {
  Routine.create(req.body)
  .then((routine) => {
    res.send(routine);
  }).catch(next)
});
// Update a routine in the databse
router.put('/routines/:id', (req,res, next) => {
  Routine.findByIdAndUpdate({_id: req.params.id}, req.body)
  .then(function(){
    Routine.findOne({_id: req.params.id}).then((routine) => {
      res.send(routine);
    });
  });
});

//Delete a routine from the database
router.delete('/routines/:id', (req,res, next) => {
  Routine.findByIdAndRemove({_id: req.params.id})
  .then((routine) => {
    res.send(routine);
  });
});

module.exports = { router };