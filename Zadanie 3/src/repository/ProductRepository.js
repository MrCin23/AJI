const knex = require("../db");
const { Model } = require("objection");
const Product = require("../model/Product");
const Category = require("../model/Category");
// const uuidv4 = require("uuid/v4")

Model.knex(knex);

class ProductRepository {

    async findAll() {
        return Product.query().withGraphFetched('category');
    }

    async findById(id) {
        return Product.query().findById(id).withGraphFetched('category');
    }

    async create(data) {
        return Product.query().insertAndFetch(data);
    }

    async update(id, data) {
        const product = await Product.query().findById(id);
        if (!product) {
            throw new Error(`Not found product with id: ${id}`);
        }
        return Product.query().patchAndFetchById(id, data);
    }


    async findByCategory(categoryId) {
        return Product.query().where('categoryId', categoryId).withGraphFetched('category');
    }


}

module.exports = new ProductRepository();