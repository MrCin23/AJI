const OrderRepository = require('../repository/OrderRepository');
const ProductRepository = require('../repository/ProductRepository');
const Order = require('../model/Order');
const OrderStatus = require('../model/OrderStatus');

class OrderManager {
    async createOrder(orderData) {
        if (!orderData.username || !orderData.email || !orderData.phoneNumber) {
            throw new Error('Missing required order fields: username, email, or phoneNumber');
        }

        if (!Array.isArray(orderData.orderedItems) || orderData.orderedItems.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        for (const item of orderData.orderedItems) {
            const product = await ProductRepository.findById(item.product.id);
            if (!product) {
                throw new Error(`Product with ID ${item.product.id} not found`);
            }
            if (item.quantity <= 0) {
                throw new Error(`Invalid quantity (${item.quantity}) for product ID ${item.product.id}`);
            }
        }

        const order = new Order(
            orderData.username,
            orderData.email,
            orderData.phoneNumber,
            orderData.orderedItems,
            new OrderStatus(orderData.status || 'PENDING'), // Default status
            orderData.approvalDate || null
        );

        return await OrderRepository.create(order);
    }

    async getAllOrders() {
        const orders = await OrderRepository.findAll();
        if (!orders.length) {
            throw new Error('No orders found');
        }
        return orders;
    }

    async getOrderById(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid order ID');
        }

        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }

        return order;
    }

    async updateOrder(id, updatedOrderData) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid order ID');
        }

        const existingOrder = await OrderRepository.findById(id);
        if (!existingOrder) {
            throw new Error(`Order with ID ${id} not found`);
        }

        const updatedOrder = new Order(
            updatedOrderData.username || existingOrder.username,
            updatedOrderData.email || existingOrder.email,
            updatedOrderData.phoneNumber || existingOrder.phoneNumber,
            updatedOrderData.orderedItems || existingOrder.orderedItems,
            new OrderStatus(updatedOrderData.status || existingOrder.status.getStatus()),
            updatedOrderData.approvalDate || existingOrder.approvalDate
        );

        return await OrderRepository.update(id, updatedOrder);
    }

    async deleteOrder(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid order ID');
        }

        const deleted = await OrderRepository.delete(id);
        if (!deleted) {
            throw new Error(`Order with ID ${id} not found or could not be deleted`);
        }

        return true;
    }
}

module.exports = new OrderManager();
