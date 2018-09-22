const express = require('express');
const router = express.Router();
const passport = require('passport');
const Diet = require('../models/diets-model');
const User = require('../models/users-model');
const jwt = require('jsonwebtoken');


router.get('/diets/:id', (req, res, next) => {
    Diet.find({
        'author': req.params.id
    }, (err, diet) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                error: 'something went wrong'
            });
        } else {
            res.send(diet)
        }
    })
});

router.get('/diets', (req, res, next) => {
    Diet.find({})
        .then((diet) => {
            res.send(diet);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

router.post('/diets', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            })
        }
    });
});

// Verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.json(403)
    }
}

router.post('/diets', (req, res, next) => {
    const payload = {
        title: req.body.title,
        calories: req.body.calories,
        img: req.body.img,
        recipe: req.body.recipe,
        notes: req.body.notes,
        author: req.body.author
    }
    Diet.create(payload)
        .then((diet) => res.status(201).json(diet))
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'something went wrong'
            });
        });
});

router.put('/diets/:id', (req, res, next) => {
    Diet.findByIdAndUpdate({
            _id: req.params.id
        }, req.body)
        .then(function () {
            Diet.findOne({
                _id: req.params.id
            }).then((diet) => {
                res.send(diet);
            });
        });
});

//Delete a routine from the database
router.delete('/diets/:id', (req, res, next) => {
    Diet.findByIdAndRemove({
            _id: req.params.id
        })
        .then((diet) => {
            res.send(diet);
        });
});


module.exports = {
    router
};