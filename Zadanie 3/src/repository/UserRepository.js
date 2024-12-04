const knex = require("../db");
const Order = require("../model/Order");
const User = require("../model/User");
const bcrypt = require('bcryptjs');
const { Model } = require("objection");
Model.knex(knex);



class UserRepository {
    async login(data) {
        const user = await this.findByLogin(data.login);
        if (!user) {
            throw new Error(`User with given: ${data.login} login not found`);
        }
        if(!(await bcrypt.compare(data.password, user.password))){
            throw new Error(`Password incorrect`);
        } else {
            return user;
        }
    }

    async findByLogin(login) {
        return User.query().findOne({login: login});
    }

    async register(data) {
        const user = await this.findByLogin(data.login);
        if(user) {
            throw new Error(`This login: ${data.login} is taken`)
        }
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        await User.knex().insert({
            login: data.login,
            password: data.password,
            role: data.role
        }).into('users');

        return User.query().findOne({login: data.login});
    }
}

module.exports = new UserRepository();