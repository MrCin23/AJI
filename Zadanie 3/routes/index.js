var express = require('express');
const productRepo = require("../src/repository/ProductRepository");
const {StatusCodes} = require("http-status-codes");
const fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/init', async function (req, res) {
  if(Object.keys(await productRepo.findAll()).length === 0) {
    try {
      var val = [];
      if(Object.keys(req.body).length === 0) {
        let jsonData;

        fs.readFile('./jason.json', 'utf8', async (err, data) => {
          if (err) {
            console.error('Error reading file jason.json:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error reading file jason.json: ${err}`);
          }
          try {
            jsonData = JSON.parse(data);
            if (jsonData instanceof Array) {
              for (const item of jsonData) {
                val.push(await productRepo.create(item));
              }
            } else {
              val = productRepo.create(jsonData);
            }
            res.status(StatusCodes.CREATED).json(val);
          } catch (parseError) {
            console.error('Error while parsing jason.json:', parseError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error while parsing file jason.json: ${err}`);
          }
        });
      } else {
        if (Array.isArray(req.body)) {
          for (const item of req.body) {
            val.push(await productRepo.create(item));
          }
        } else {
          val.push(await productRepo.create(req.body));
        }
        res.status(StatusCodes.CREATED).json(val);
      }
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).send(`Cannot create product, maybe some properties missing: ${err}`);
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).send(`Cannot initialize data, there are currently ${Object.keys(await productRepo.findAll()).length} product(s) in the database`);
  }
});

module.exports = router;
