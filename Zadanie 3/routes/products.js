var express = require('express');
var router = express.Router();
var productManager = require('../src/managers/ProductManager');
const productRepo = require('../src/repository/ProductRepository');

router.get('/', async function (req, res, next) {
    try {
        const val = await productRepo.findAll();
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const val = await productRepo.findById(req.params.id);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});

router.post('/', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({}))
})

router.put('/:id', function(req, res, next) {
    res.send("Here we will update the product with id");
})

module.exports = router;
