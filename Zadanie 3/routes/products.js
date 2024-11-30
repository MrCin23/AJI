var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.send('That are products');
});

/* GET products listing. */
router.get('/:id', function(req, res, next) {
    res.send('This is product with id');
});

router.post('/', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({}))
})

router.put('/:id', function(req, res, next) {
    res.send("Here we will update the product with id");
})

module.exports = router;
