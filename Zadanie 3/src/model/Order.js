const OrderStatus = require('./OrderStatus');
const Product = require('./Product');

class Order {
    constructor(username, email, phoneNumber, orderedItems, status, approvalDate = null) {
        if (!username || typeof username !== "string") {
            throw new Error("Invalid username: must be a non-empty string.");
        }
        if (!email || !Order.isValidEmail(email)) {
            throw new Error("Invalid email format.");
        }
        if (!phoneNumber || typeof phoneNumber !== "string") {
            throw new Error("Invalid phone number: must be a non-empty string.");
        }
        if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
            throw new Error("Invalid ordered items: must be a non-empty array.");
        }
        if (!orderedItems.every(item => item.product instanceof Product && Number.isInteger(item.quantity) && item.quantity > 0)) {
            throw new Error("Invalid ordered items: each item must have a valid Product and a positive integer quantity.");
        }
        if (!(status instanceof OrderStatus)) {
            throw new Error("Invalid order status: must be an instance of OrderStatus.");
        }
        if (approvalDate && !(approvalDate instanceof Date)) {
            throw new Error("Invalid approval date: must be a Date object or null.");
        }

        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.orderedItems = orderedItems;
        this.status = status;
        this.approvalDate = approvalDate;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    getDetails() {
        return {
            username: this.username,
            email: this.email,
            phoneNumber: this.phoneNumber,
            orderedItems: this.orderedItems.map(item => ({
                product: item.product.name,
                quantity: item.quantity
            })),
            status: this.status.getStatus(),
            approvalDate: this.approvalDate
        };
    }


    changeStatus(newStatus) {
        if (!(newStatus instanceof OrderStatus)) {
            throw new Error("Invalid status: must be an instance of OrderStatus.");
        }
        this.status = newStatus;
    }
}

module.exports = Order;
