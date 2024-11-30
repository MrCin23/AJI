const CategoryModel = require('../orm/Category');
const Category = require('../model/Category');

class CategoryRepository {
    async create(category) {
        // Zamiana klasy na model ORM
        const created = await CategoryModel.create({ name: category.name });
        return new Category(created.name); // Zamiana z powrotem na klasę
    }

    async findAll() {
        const categories = await CategoryModel.findAll();
        return categories.map(c => new Category(c.name));
    }

    async findById(id) {
        const category = await CategoryModel.findByPk(id);
        if (!category) return null;
        return new Category(category.name);
    }
}

module.exports = new CategoryRepository();
