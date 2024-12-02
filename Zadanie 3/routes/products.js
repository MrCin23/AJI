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

router.post('/', async function (req, res, next) {
    try {
        const val = await productRepo.create(req.body);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('An error occurred');
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        const val = await productRepo.update(req.params.id, req.body);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('An error occurred');
    }
})

module.exports = router;
