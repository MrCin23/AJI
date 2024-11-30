const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CategoryModel = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = CategoryModel;
