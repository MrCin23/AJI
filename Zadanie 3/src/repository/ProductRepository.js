const knex = require("../db");
const uuidv4 = require("uuid/v4")

class ProductRepository {
    findAll() {
        console.log('Starting query');
        return knex('product').select('*').then(data => {
            console.log('Query resolved:', data);
            return data;
        }).catch(err => {
            console.error('Query error:', err);
            throw err;
        });
    }
    findById(id) {
        console.log('Starting query');
        return knex('product').select('*').where({id:id}).then(data => {
            console.log('Query resolved:', data);
            return data;
        }).catch(err => {
            console.error('Query error:', err);
            throw err;
        });
    }
    create(){
        uuidv4()
        //create object -> json -> query
        console.log('Starting query');
        return knex('product').select('*').where({id:id}).then(data => {
            console.log('Query resolved:', data);
            return data;
        }).catch(err => {
            console.error('Query error:', err);
            throw err;
        });
    }
    update(field, value){
        //query with update
        // UPDATE Customers
        // SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
        // WHERE CustomerID = 1;
        console.log('Starting query');
        return knex('product').select('*').where({id:id}).then(data => {
            console.log('Query resolved:', data);
            return data;
        }).catch(err => {
            console.error('Query error:', err);
            throw err;
        });
    }
}

module.exports = new ProductRepository();