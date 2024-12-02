const { Model } = require('objection');

class OrderStatus extends Model {
    static get tableName() {
        return 'order_status';
    }

    static get STATUSES() {
        return {
            UNAPPROVED: "UNAPPROVED",
            APPROVED: "APPROVED",
            CANCELLED: "CANCELLED",
            COMPLETED: "COMPLETED",
        };
    }

    static isValidStatus(status) {
        return Object.values(OrderStatus.STATUSES).includes(status);
    }

    static get relationMappings() {
        return {
            orders: {
                relation: Model.HasManyRelation,
                modelClass: require('Order'),
                join: {
                    from: 'order_status.id',
                    to: 'orders.status_id'
                }
            }
        };
    }


    static get jsonSchema() {
        return {
            type: 'object',
            required: ['status'],
            properties: {
                id: { type: 'integer' },
                status: {
                    type: 'string',
                    enum: Object.values(OrderStatus.STATUSES),
                },
            },
        };
    }
}

module.exports = OrderStatus;
