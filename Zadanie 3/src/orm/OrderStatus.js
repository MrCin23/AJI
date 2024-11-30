const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Połączenie z bazą danych

const OrderStatusModel = sequelize.define('OrderStatus', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Zakładając, że statusy są unikalne
        validate: {
            isIn: {
                args: [
                    ['UNAPPROVED', 'APPROVED', 'CANCELLED', 'COMPLETED'],
                ],
                msg: 'Invalid status',
            },
        },
    },
});

module.exports = OrderStatusModel;
