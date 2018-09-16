const express = require('express');
const User = require('../models/users-model');
const router = express.Router();


//Get users

router.get('/users', (req, res) =>{
    User.find({})
    .then((users) => {
        res.json(users);
    }).catch((err) => {
        res.status(500).json({
            error: 'something went wrong'
        });
    });
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    res.send('logging out');
})

router.get('/google', (req, res) => {
    //handle with passport
    res.send('logging in with google');
});

router.post('/users', (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    User.findOne({email})
});

module.exports = { router };