const knex = require("../db");

class CategoryRepository {
    findAll() {
        console.log('Starting query');
        return knex('category').select('*').then(data => {
            console.log('Query resolved:', data);
            return data;
        }).catch(err => {
            console.error('Query error:', err);
            throw err;
        });
    }
}

module.exports = new CategoryRepository();