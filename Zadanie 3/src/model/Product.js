const { Model } = require('objection');
const Category = require('./Category'); // Model Category

class Product extends Model {

    static get tableName() {
        return 'product';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'description', 'unit_price', 'unit_weight', 'category_id'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1 },
                description: { type: 'string', minLength: 1 },
                unit_price: { type: 'number', minimum: 0.01 },
                unit_weight: { type: 'number', minimum: 0.01 },
                category_id: { type: 'integer' },
            },
        };
    }


    static get relationMappings() {
        return {
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'product.category_id',
                    to: 'category.id',
                },
            },
        };
    }


    async changeCategory(newCategoryId) {

        const categoryExists = await Category.query().findById(newCategoryId);
        if (!categoryExists) {
            throw new Error(`Invalid category: Category with ID ${newCategoryId} does not exist.`);
        }


        return this.$query().patchAndFetch({ categoryId: newCategoryId });
    }


    async getDetails() {
        const category = await this.$relatedQuery('category');
        return {
            name: this.name,
            description: this.description,
            unit_price: this.unit_price,
            unit_weight: this.unit_weight,
            category: category.name,
        };
    }

    // async toString() {
    //     const category = await this.$relatedQuery('category');
    //     return `name: ${this.name},
    //         description: ${this.description},
    //         unit_price: ${this.unit_price},
    //         unit_weight: ${this.unit_weight},
    //         category: ${category.name}`
    // }
}

module.exports = Product;
