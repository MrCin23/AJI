const knex = require("../db");
const { Model } = require("objection");
const Product = require("../model/Product");
const Category = require("../model/Category");


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
        if(!data.id) {
            return Product.query().patchAndFetchById(id, data);
        }
        else {
            throw new Error(`Cannot change ID of the product!`);
        }
    }


    async findByCategory(categoryId) {
        return Product.query().where('categoryId', categoryId).withGraphFetched('category');
    }


}

module.exports = new ProductRepository();