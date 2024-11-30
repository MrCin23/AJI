const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Połączenie z bazą danych
const OrderStatusModel = require('./OrderStatus');
const ProductModel = require('./Product');

const OrderModel = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['UNAPPROVED', 'APPROVED', 'CANCELLED', 'COMPLETED']],
        },
    },
});

// Relacja M:N między Order i Product poprzez tabelę OrderItems
OrderModel.belongsToMany(ProductModel, { through: 'OrderItems' });
ProductModel.belongsToMany(OrderModel, { through: 'OrderItems' });

module.exports = OrderModel;
