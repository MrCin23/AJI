const { Sequelize } = require('sequelize');

// Konfiguracja połączenia z PostgreSQL
const sequelize = new Sequelize('computer_shop', 'aji', 'aji', {
    host: 'localhost:5432',
    dialect: 'postgres',
    logging: false, // Wyłącz logi SQL (opcjonalne)
});

module.exports = sequelize;
