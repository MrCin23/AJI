const db = require('../db'); // Import konfiguracji bazy danych
const Order = require('../model/Order');  // Model Order
const { Model } = require('objection');
const OrderStatus = require('../model/OrderStatus');
const knex = require("../db");
const Product = require("../model/Product");  // Model OrderStatus

Model.knex(knex);

class OrderRepository {

    async findAll() {
        return Order.query()//.withGraphFetched('status, ordered_items');
    }



    async findByStatus(statusId) {
        return Order.query()
            .join('order_status', 'order.status_id', '=', 'order_status.id')
            .where('order_status.id', statusId);
            //.withGraphFetched('status, ordered_items');
    }



    async create(orderData) {
        const { status_id, orderedItems, ...otherData } = orderData;

        const statusInstance = await OrderStatus.query().findOne('id', status_id);

        if (!statusInstance) {
            throw new Error(`Invalid status: ${status_id}`);
        }

        // const order = await Order.query().insertAndFetch({
        //     ...otherData,
        //     status_id: statusInstance.id,
        //     ordered_items: ordered_items,
        // });
        return Product.query().insert(orderData);

    }


    async updateStatus(id, newStatus) {
        const statusInstance = await OrderStatus.query().findOne('status', newStatus);

        if (!statusInstance) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        return Order.query().patchAndFetchById(id, {
            statusId: statusInstance.id,
        });
    }
}

module.exports = new OrderRepository();
