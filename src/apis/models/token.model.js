const { tokenTypes } = require('../../configs/enum')

const tokenModel = (sequelize, Sequelize, DataTypes) => {
    const Token = sequelize.define(
        'token',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                notEmpty: true,
            },
            type: {
                type: DataTypes.STRING,
                type: Sequelize.ENUM,
                values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
                allowNull: false,
                notEmpty: true,
            },
            expires: {
                type: DataTypes.DATE,
                allowNull: false,
                notEmpty: true,
            },
        },
        {
            timestamp: true,
        }
    )

    return Token
}

module.exports.tokenModel = tokenModel
