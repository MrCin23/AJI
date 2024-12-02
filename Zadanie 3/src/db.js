const db = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'aji',
        password: 'aji',
        database: 'computer_shop',
    },
});

module.exports = db;
