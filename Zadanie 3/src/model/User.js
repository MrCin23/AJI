const { Model } = require('objection');
const OrderStatus = require("./OrderStatus");

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['login', 'password', 'role'],
            properties: {
                login: { type: 'string', minLength: 1, maxLength: 30},
                password: { type: 'string', minLength: 8 },
                role: { type: 'string', enum: ['CLIENT', 'EMPLOYEE'] }
            }
        };
    }

    static get relationMappings() {
        return {
            username: {
                relation: Model.HasManyRelation,
                modelClass: require("./Order"),
                join: {
                    from: 'users.login',
                    to: 'orders.username',
                },
            },
        };
    }
}

module.exports = User;

