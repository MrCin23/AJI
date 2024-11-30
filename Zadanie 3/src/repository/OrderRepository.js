const OrderModel = require('../orm/Order');
const OrderStatus = require('../model/OrderStatus');
const ProductRepository = require('./ProductRepository');
const Order = require('../model/Order');

class OrderRepository {
    async create(order) {

        const createdOrder = await OrderModel.create({
            username: order.username,
            email: order.email,
            phoneNumber: order.phoneNumber,
            approvalDate: order.approvalDate,
            status: order.status.getStatus(),
        });

        for (const item of order.orderedItems) {
            const product = await ProductRepository.findById(item.product.id);
            if (!product) {
                throw new Error(`Product with ID ${item.product.id} not found.`);
            }
            await createdOrder.addProduct(product, { through: { quantity: item.quantity } });
        }

        return new Order(
            createdOrder.username,
            createdOrder.email,
            createdOrder.phoneNumber,
            order.orderedItems,
            new OrderStatus(createdOrder.status),
            createdOrder.approvalDate
        );
    }

    async findAll() {
        const orders = await OrderModel.findAll({
            include: {
                model: ProductRepository.getProductModel(),
                through: {
                    attributes: ['quantity'], // Ilość dla każdego produktu
                },
            },
        });

        return orders.map(o => new Order(
            o.username,
            o.email,
            o.phoneNumber,
            o.Products.map(p => ({ product: p, quantity: p.OrderItems.quantity })),
            new OrderStatus(o.status),
            o.approvalDate
        ));
    }

    async findById(id) {
        const order = await OrderModel.findByPk(id, {
            include: {
                model: ProductRepository.getProductModel(),
                through: {
                    attributes: ['quantity'],
                },
            },
        });
        if (!order) return null;

        return new Order(
            order.username,
            order.email,
            order.phoneNumber,
            order.Products.map(p => ({ product: p, quantity: p.OrderItems.quantity })),
            new OrderStatus(order.status),
            order.approvalDate
        );
    }

    async update(id, newOrderData) {
        const order = await OrderModel.findByPk(id);
        if (!order) return null;

        order.username = newOrderData.username;
        order.email = newOrderData.email;
        order.phoneNumber = newOrderData.phoneNumber;
        order.status = newOrderData.status.getStatus();
        order.approvalDate = newOrderData.approvalDate;

        await order.save();

        return new Order(
            order.username,
            order.email,
            order.phoneNumber,
            newOrderData.orderedItems,
            new OrderStatus(order.status),
            order.approvalDate
        );
    }

    async delete(id) {
        const order = await OrderModel.findByPk(id);
        if (!order) return null;

        await order.destroy();
        return true;
    }
}

module.exports = new OrderRepository();
