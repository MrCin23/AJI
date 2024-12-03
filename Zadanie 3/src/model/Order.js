const { Model } = require('objection');
const OrderStatus = require('./OrderStatus');  // Model OrderStatus
const Product = require('./Product');  // Model Product

class Order extends Model {
    static get tableName() {
        return 'orders';
    }

    static get relationMappings() {
        return {
            order_status: {
                relation: Model.BelongsToOneRelation,
                modelClass: OrderStatus,
                join: {
                    from: 'orders.status_id',
                    to: 'order_status.id',
                },
            },
            // ordered_items: {
            //     relation: Model.HasManyRelation,
            //     modelClass: Product,
            //     join: {
            //         from: 'orders.id',
            //         to: 'product.id',
            //     },
            // },
        };
    }


    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'phone_number', 'status_id'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string', minLength: 1 },
                email: { type: 'string', minLength: 1 },
                phone_number: { type: 'string', minLength: 9, maxLength: 9 }, //Regex
                status_id: { type: 'integer' },
                approval_date: { type: 'string', format: 'date-time', nullable: true },
                ordered_items: { type: 'array' },
            },
        };
    }
}

module.exports = Order;
