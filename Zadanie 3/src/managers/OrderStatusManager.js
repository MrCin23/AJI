const OrderStatusRepository = require('../repository/OrderStatusRepository');
const OrderStatus = require('../model/OrderStatus');

class OrderStatusManager {
    async createOrderStatus(status) {
        if (!OrderStatus.isValidStatus(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        const orderStatus = new OrderStatus(status);
        return await OrderStatusRepository.create(orderStatus);
    }

    async getAllOrderStatuses() {
        const statuses = await OrderStatusRepository.findAll();
        if (statuses.length === 0) {
            throw new Error('No order statuses found');
        }
        return statuses;
    }

    async getOrderStatusById(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid status ID');
        }

        const status = await OrderStatusRepository.findById(id);
        if (!status) {
            throw new Error(`Order status with ID ${id} not found`);
        }

        return status;
    }

    async updateOrderStatus(id, newStatus) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid status ID');
        }

        if (!OrderStatus.isValidStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        const updatedStatus = await OrderStatusRepository.update(id, newStatus);
        if (!updatedStatus) {
            throw new Error(`Order status with ID ${id} not found or could not be updated`);
        }

        return updatedStatus;
    }

    async deleteOrderStatus(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid status ID');
        }

        const deleted = await OrderStatusRepository.delete(id);
        if (!deleted) {
            throw new Error(`Order status with ID ${id} not found or could not be deleted`);
        }

        return true;
    }
}

module.exports = new OrderStatusManager();
