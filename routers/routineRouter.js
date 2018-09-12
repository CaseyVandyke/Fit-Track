'use strict'

const express = require('express');
const router = express.Router();
const Routine = require('../models/routine-model')

//Get all routines from the database
router.get('/routines', function(req,res){
  res.send({type: 'GET'})
});

// Add a new routine in the databse
router.post('/routines', function(req,res){
  Routine.create(req.body)
  .then(function(routine){
    res.send(routine);
  });
});
// Update a routine in the databse
router.get('/routines/:id', function(req,res){
  res.send({type: 'PUT'});
});

//Delete a routine from the database
router.delete('/routines/:id', function(req,res){
  res.send({type: 'DELETE'});
});

module.exports = router;