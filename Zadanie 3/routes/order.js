var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('categories');
});
router.post('/', function(req, res, next) {
    res.send('categories');
});
router.patch('/:id', function(req, res, next) {
    res.send('categories');
});
router.get('/status/:id', function(req, res, next) {
    res.send('categories');
});

module.exports = router;
