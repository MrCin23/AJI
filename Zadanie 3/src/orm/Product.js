const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Połączenie z bazą danych
const CategoryModel = require('./Category'); // Odwołanie do modelu kategorii

const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0.01,
        },
    },
    unitWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0.01,
        },
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CategoryModel,
            key: 'id',
        },
    },
});

//One to many
ProductModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

module.exports = ProductModel;
