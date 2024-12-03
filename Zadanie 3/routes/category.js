var express = require('express');
var categoryRepo = require('../src/repository/CategoryRepository');
const { StatusCodes } = require('http-status-codes');
var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const val = await categoryRepo.findAll();
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(`Categories not found: ${err}`);
    }
});

module.exports = router;
