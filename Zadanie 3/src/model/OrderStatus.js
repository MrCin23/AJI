class OrderStatus {

    static STATUSES = {
        UNAPPROVED: "UNAPPROVED",
        APPROVED: "APPROVED",
        CANCELLED: "CANCELLED",
        COMPLETED: "COMPLETED"
    };

    constructor(status) {
        if (!OrderStatus.isValidStatus(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
        this.status = status;
    }


    static isValidStatus(status) {
        return Object.keys(OrderStatus.STATUSES).includes(status);
    }


    getStatuses() {
        return OrderStatus.STATUSES[this.status];
    }


    getStatus() {
        return this.status;
    }


    setStatus(newStatus) {
        if (!OrderStatus.isValidStatus(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }
        this.status = newStatus;
    }
}

module.exports = OrderStatus;
