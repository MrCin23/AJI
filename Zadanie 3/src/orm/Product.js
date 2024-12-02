const knex = require('../db');

const productModel = {
    tableName: 'product',

    schema: (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.float('unitPrice').notNullable().checkPositive();
        table.float('unitWeight').notNullable().checkPositive();
        table
            .integer('categoryId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('category')
            .onDelete('CASCADE');
    },

    async initialize() {
        const exists = await knex.schema.hasTable(this.tableName);
        if (!exists) {
            await knex.schema.createTable(this.tableName, this.schema);
            console.log(`Table ${this.tableName} created.`);
        }
    },
};

module.exports = productModel;