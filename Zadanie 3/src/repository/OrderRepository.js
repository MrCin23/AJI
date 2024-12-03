const db = require('../db'); // Import konfiguracji bazy danych
const Order = require('../model/Order');  // Model Order
const { Model } = require('objection');
const OrderStatus = require('../model/OrderStatus');
const knex = require("../db");
const Product = require("../model/Product");  // Model OrderStatus


Model.knex(knex);

class OrderRepository {



    async findAll() {

        const orders = await Order.query().withGraphFetched('order_status');

        for (const order of orders) {
            let items;


            if (Array.isArray(order.ordered_items)) {
                items = order.ordered_items;
            } else if (typeof order.ordered_items === 'string') {
                items = JSON.parse(order.ordered_items);
            } else {
                throw new Error(`Invalid format for ordered_items: ${order.ordered_items}`);
            }

            const productIds = items.map((item) => item.product_id);
            const products = await Product.query().findByIds(productIds);

            order.products = products.map((product) => ({
                ...product,
                quantity: items.find((item) => item.product_id === product.id).quantity,
            }));
        }

        return orders;
    }

    async findById(Id) {

        const orders = await Order.query()
            .withGraphFetched('order_status')
            .where('id', Id);


        for (const order of orders) {
            let items;

            if (Array.isArray(order.ordered_items)) {
                items = order.ordered_items;
            } else if (typeof order.ordered_items === 'string') {
                items = JSON.parse(order.ordered_items);
            } else {
                throw new Error(`Invalid format for ordered_items: ${order.ordered_items}`);
            }

            const productIds = items.map((item) => item.product_id);
            const products = await Product.query().findByIds(productIds);


            order.products = products.map((product) => ({
                ...product,
                quantity: items.find((item) => item.product_id === product.id).quantity,
            }));
        }

        return orders.at(0);
    }

    async findByStatus(statusId) {

        const orders = await Order.query()
            .withGraphFetched('order_status')
            .where('status_id', statusId);


        for (const order of orders) {
            let items;

            if (Array.isArray(order.ordered_items)) {
                items = order.ordered_items;
            } else if (typeof order.ordered_items === 'string') {
                items = JSON.parse(order.ordered_items);
            } else {
                throw new Error(`Invalid format for ordered_items: ${order.ordered_items}`);
            }

            const productIds = items.map((item) => item.product_id);
            const products = await Product.query().findByIds(productIds);


            order.products = products.map((product) => ({
                ...product,
                quantity: items.find((item) => item.product_id === product.id).quantity,
            }));
        }

        return orders;
    }

    async findByUsername(username) {

        const orders = await Order.query()
            .withGraphFetched('order_status')
            .where('username', username);

        if (orders == 0) {
            throw new Error(`User not found: ${username}`);
        }

        for (const order of orders) {
            let items;

            if (Array.isArray(order.ordered_items)) {
                items = order.ordered_items;
            } else if (typeof order.ordered_items === 'string') {
                items = JSON.parse(order.ordered_items);
            } else {
                throw new Error(`Invalid format for ordered_items: ${order.ordered_items}`);
            }

            const productIds = items.map((item) => item.product_id);
            const products = await Product.query().findByIds(productIds);


            order.products = products.map((product) => ({
                ...product,
                quantity: items.find((item) => item.product_id === product.id).quantity,
            }));
        }

        return orders;
    }

    async create(orderData) {
        const { status_id, ordered_items, ...otherData } = orderData;

        // Retrieve the status instance
        const statusInstance = await OrderStatus.query().findOne('id', status_id);

        if (!statusInstance) {
            throw new Error(`Invalid status: ${status_id}`);
        }

        const orderedItemsData = ordered_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
        }));


        const products = await Promise.all(
            orderedItemsData.map(async (order) => {
                const product = await Product.query().findById(order.product_id).withGraphFetched('category');

                product.unit_price = parseFloat(product.unit_price);
                product.unit_weight = parseFloat(product.unit_weight);
                return { ...product, quantity: order.quantity };
            })
        );


        const order = await Order.query().insertAndFetch({
            ...otherData,
            status_id: statusInstance.id,
            ordered_items: orderedItemsData,
            // ordered_items: products.map((product) => ({
            //     quantity: product.quantity,
            //     product_id: product.id,
            // }))
        });

        return order;
    }

    async updateStatus(id, newStatusID) {
        const order = await Order.query().findById(id);
        if (!order) {
            throw new Error(`Not found product with id: ${id}`);
        }
        const statusInstance = await OrderStatus.query().findOne('id', newStatusID.status_id);
        const actualStatus = (await this.findById(id)).order_status.status;
        const actualStatusId = (await this.findById(id)).order_status.id;
        if (!statusInstance) {
            throw new Error(`Invalid status: ${newStatusID}`);
        }

        if(actualStatus != 'CANCELLED') {
            if(statusInstance.id > actualStatusId) {
                return Order.query().patchAndFetchById(id, {
                    status_id: statusInstance.id,
                });
            }
            else {
                throw new Error("Cannot change status backwards!")
            }
        }
        else {
            throw new Error("Cannot change status of CANCELLED order!")
        }
    }
}

module.exports = new OrderRepository();
