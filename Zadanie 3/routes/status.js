var express = require('express');
const orderStatusRepo = require("../src/repository/OrderStatusRepository");
var router = express.Router();


router.get('/', async function (req, res, next) {
    try {
        const val = await orderStatusRepo.findAll();
        console.log(val);
        res.json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
