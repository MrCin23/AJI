var express = require('express');
const orderStatusRepo = require("../src/repository/OrderStatusRepository");
const { StatusCodes } = require('http-status-codes');
var router = express.Router();


router.get('/', async function (req, res, next) {
    try {
        const val = await orderStatusRepo.findAll();
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(StatusCodes.NOT_FOUND).send(`Order Statuses not found : ${err}`);
    }
});

module.exports = router;
