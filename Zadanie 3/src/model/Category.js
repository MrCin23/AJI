// class Category {
//     constructor(name) {
//         this.name = name;
//     }
// }
//
// module.exports = Category;


const { Model } = require('objection');

class Category extends Model {
    static get tableName() {
        return 'category';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1 },
            },
        };
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.HasManyRelation,
                modelClass: require('./Product'),
                join: {
                    from: 'category.id',
                    to: 'product.categoryId',
                },
            },
        };
    }

    static isValidCategory(categoryId) {
        return this.query().findById(categoryId).then(Boolean);
    }
}

module.exports = Category;
