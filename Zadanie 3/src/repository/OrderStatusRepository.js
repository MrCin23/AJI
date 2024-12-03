const db = require('../db'); // Import konfiguracji bazy danych
const { Model } = require('objection');
const OrderStatus = require('../model/OrderStatus'); // Model OrderStatus

Model.knex(db);

class OrderStatusRepository {

    static async findAll() {
        return OrderStatus.query();
    }


    static async findById(id) {
        return OrderStatus.query().findById(id);
    }


    static async findByStatus(status) {
        return OrderStatus.query().where('status', status).first();
    }


    static async create(data) {
        if (!OrderStatus.isValidStatus(data.status)) {
            throw new Error(`Invalid status: ${data.status}`);
        }
        return OrderStatus.query().insertAndFetch(data);
    }


    static async deleteById(id) {
        return OrderStatus.query().deleteById(id);
    }
}

module.exports = OrderStatusRepository;
