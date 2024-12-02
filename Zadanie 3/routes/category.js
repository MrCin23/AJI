var express = require('express');
var router = express.Router();
var categoryRepo = require('../src/repository/CategoryRepository');

router.get('/', async function(req, res, next) {
    try {
        const val = await categoryRepo.findAll();
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
