var express = require('express');
var router = express.Router();
const orderRepo = require('../src/repository/OrderRepository');


router.get('/', async function (req, res, next) {
    try {
        const val = await orderRepo.findAll();
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});
router.post('/', async function (req, res, next) {
    try {
        const val = await orderRepo.create(req.body);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});
router.patch('/:id', async function (req, res, next) {
    try {
        const val = await orderRepo.updateStatus(req.params.id, req.body);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});
router.get('/status/:id', async function (req, res, next) {
    try {
        const val = await orderRepo.findByStatus(req.params.id);
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
