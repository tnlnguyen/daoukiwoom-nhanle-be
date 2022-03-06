const { Sequelize, DataTypes, Options } = require("sequelize");
const { database } = require("../../configs/env");

const { userModel } = require("./user.model");
const { tokenModel } = require("./token.model");

const { host, user, password, dialect, db } = database;

const configuration = {
    host: host,
    dialect: dialect,
    pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

const sequelize = new Sequelize(db, user, password, configuration);

const User = userModel(sequelize, Sequelize, DataTypes)
const Token = tokenModel(sequelize, Sequelize, DataTypes)

// Association
User.hasMany(Token)

const initialize = async () => {
    await sequelize.sync();
}
initialize();

module.exports.database = {
    Sequelize,
    sequelize,
    user: User,
    token: Token,
};