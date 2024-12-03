var express = require('express');
var router = express.Router();
const productRepo = require('../src/repository/ProductRepository');
const { StatusCodes } = require('http-status-codes');
const { val} = require("objection");
var config = require('./config');


async function setupGroq() {
    const { default: Groq } = await import('groq-sdk');
    return new Groq({
        dangerouslyAllowBrowser: true,
        apiKey: config.config.GROQAPI,
    });
}

async function generateSEO(product) {
    const groq = await setupGroq();
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": `Na podstawie produktu: ${JSON.stringify(product)} wygeneruj stronę HTML przedstawiającą produkt zgodnie z wymaganiami SEO. Zwróć jedynie zawartość pliku HTML, bez komentarzy.`
            }
        ],
        "model": "llama3-8b-8192",
        "temperature": 0,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    let result = "";
    for await (const chunk of chatCompletion) {
        result += chunk.choices[0]?.delta?.content || '';
    }
    return result;
}

router.get('/', async function (req, res, next) {
    try {
        const val = await productRepo.findAll();
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(`Products not found: ${err}`);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const val = await productRepo.findById(req.params.id);
        res.status(StatusCodes.OK).json(val);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(StatusCodes.NOT_FOUND).send(`Product with id ${req.params.id} not found: ${err}`);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const val = await productRepo.create(req.body);
        res.status(StatusCodes.CREATED).json(val);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(`Cannot create product, maybe some properties missing: ${err}`);
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        const val = await productRepo.update(req.params.id, req.body);
        res.status(StatusCodes.NO_CONTENT).json(val);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(StatusCodes.BAD_REQUEST).send(`Cannot update product, maybe some properties are wrong: ${err}`);
    }
})

router.get('/:id/seo-description', async function (req, res, next) {
    try {
        const val = await productRepo.findById(req.params.id);
        res.status(StatusCodes.OK).send(await generateSEO(val));
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(StatusCodes.NOT_FOUND).send(`Product with id ${req.params.id} not found: ${err}`);
    }
})

module.exports = router;
