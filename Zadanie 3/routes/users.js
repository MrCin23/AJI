var express = require('express');
var router = express.Router();
var userRepository = require('../src/repository/UserRepository');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require("http-status-codes");
const {config} = require("./config");

const JWT_EXPIRATION = '1h';

const generateToken = (user) => {
  const payload = {
    login: user.login,
    role: user.role
  };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Missing token' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token incorrect' });
    }

    req.user = decoded;
    next();
  });
};

router.post('/login', async function (req, res, next) {
  try {
    var user = await userRepository.login(req.body);
    if(user){
      res.status(StatusCodes.OK).send(generateToken(user));
    }
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).send('Unauthorized, perhaps the provided password is incorrect');
  }
});

router.post('/register', async function (req, res, next) {
  try {
    var val = await userRepository.register(req.body);
    res.status(StatusCodes.OK).json(val);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(`User with login ${req.params.login} already exists` + err);
  }
});

router.get('/:login', async function (req, res, next) {
  try {
    var val = await userRepository.findByLogin(req.params.login);
    res.status(StatusCodes.OK).send(val);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).send(`User with login ${req.params.login}` + err);
  }
});

router.get('/new/token', verifyToken, async function (req, res, next) {
  res.status(StatusCodes.OK).send(generateToken(await userRepository.findByLogin(req.user.login)));
})

module.exports = router;
