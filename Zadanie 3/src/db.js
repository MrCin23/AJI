const { Sequelize } = require('sequelize');

// Konfiguracja połączenia z PostgreSQL
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Wyłącz logi SQL (opcjonalne)
});

module.exports = sequelize;
