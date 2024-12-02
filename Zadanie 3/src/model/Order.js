const { Model } = require('objection');
const OrderStatus = require('./OrderStatus');  // Model OrderStatus
const Product = require('./Product');  // Model Product

class Order extends Model {
    static get tableName() {
        return 'orders';
    }

    static get relationMappings() {
        return {
            status: {
                relation: Model.BelongsToOneRelation,
                modelClass: OrderStatus,
                join: {
                    from: 'orders.status_id',
                    to: 'order_statuses.id',
                },
            },
            orderedItems: {
                relation: Model.HasManyRelation,
                modelClass: Product,
                join: {
                    from: 'orders.id',
                    to: 'product.order_id',
                },
            },
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'phone_number', 'status_id', 'ordered_items'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                email: { type: 'string' },
                phone_number: { type: 'string' },
                status_id: { type: 'integer' },
                approval_date: { type: 'string', format: 'date-time', nullable: true },
                ordered_items: { type: 'array' },
            },
        };
    }
}

module.exports = Order;
