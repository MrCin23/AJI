const CategoryRepository = require('../repository/CategoryRepository');
const Category = require('../model/Category');

class CategoryManager {
    async createCategory(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Invalid category name');
        }

        const category = new Category(name);
        return await CategoryRepository.create(category);
    }

    async getAllCategories() {
        const categories = await CategoryRepository.findAll();
        if (categories.length === 0) {
            throw new Error('No categories found');
        }
        return categories;
    }

    async getCategoryById(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid category ID');
        }

        const category = await CategoryRepository.findById(id);
        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }

        return category;
    }
}

module.exports = new CategoryManager();
