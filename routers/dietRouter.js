const express = require('express');
const router = express.Router();
const {
    Author,
    Diet
} = require('../models/diets-model')

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

router.post('/diets', (req, res, next) => {
    Diet.create(req.body)
        .then((diet) => {
            res.send(diet);
        }).catch(next)
});

router.put('/diets/:id', (req, res, next) => {
    Diet.findByIdAndUpdate({
            _id: req.params.id
        }, req.body)
        .then(function () {
            Diet.findOne({
                _id: req.params.id
            }).then((routine) => {
                res.send(routine);
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