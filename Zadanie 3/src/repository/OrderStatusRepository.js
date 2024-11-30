const OrderStatusModel = require('../orm/OrderStatus');
const OrderStatus = require('../model/OrderStatus');

class OrderStatusRepository {
    async create(orderStatus) {
        // Zamiana klasy na model ORM
        const created = await OrderStatusModel.create({ status: orderStatus.getStatus() });
        return new OrderStatus(created.status); // Zamiana na klasę
    }

    async findAll() {
        const statuses = await OrderStatusModel.findAll();
        return statuses.map(status => new OrderStatus(status.status));
    }

    async findById(id) {
        const status = await OrderStatusModel.findByPk(id);
        if (!status) return null;
        return new OrderStatus(status.status);
    }

    async update(id, newStatus) {
        const status = await OrderStatusModel.findByPk(id);
        if (!status) return null;

        if (!OrderStatus.isValidStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }
        status.status = newStatus;
        await status.save();
        return new OrderStatus(status.status);
    }

    async delete(id) {
        const status = await OrderStatusModel.findByPk(id);
        if (!status) return null;

        await status.destroy();
        return true;
    }
}

module.exports = new OrderStatusRepository();
