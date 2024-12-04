var express = require('express');
const orderRepo = require('../src/repository/OrderRepository');
const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");
const {config} = require("./config");
var router = express.Router();
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Missing token' });
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token incorrect' });
        }

        req.user = decoded;
        if(decoded.role != "CLIENT") {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is not authorized for this action' });
        }
        next();
    });
};

router.get('/', async function (req, res, next) {
    try {
        const val = await orderRepo.findAll();
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send('Orders not found: ' + err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const val = await orderRepo.findById(req.params.id);
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send('Order not found: ' + err);
    }
})

router.post('/', async function (req, res, next) {
    try {
        const val = await orderRepo.create(req.body);
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send('Bad request, maybe some of properties missing: ' + err);
    }
});
router.patch('/:id', async function (req, res, next) {
    try {
        const val = await orderRepo.updateStatus(req.params.id, req.body);
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Unproperly patch, make sure properties are OK: ' + err);
    }
});
router.get('/status/:id', async function (req, res, next) {
    try {
        const val = await orderRepo.findByStatus(req.params.id);
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send('Status not found: ' + err);
    }
});

router.get('/user/:username', async function (req, res, next) {
    try {
        const val = await orderRepo.findByUsername(req.params.username);
        console.log(val);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(`Username ${req.params.username} not found: ${err}`);
    }
})

router.post('/:id/opinions', verifyToken, async function (req, res, next) {
    try {
        if ((await orderRepo.findById(req.params.id)).username == req.user.login){
            const {id} = req.params;
            const data = req.body;
            const updatedOrder = await orderRepo.addOpinion(id, data);
            res.status(StatusCodes.CREATED).json(updatedOrder);
        } else {
            res.status(StatusCodes.FORBIDDEN).json({error: `User is not allowed to do that! Order created by: ${(await orderRepo.findById(req.params.id)).username}`})
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error: error.message});
    }
});

module.exports = router;
