const bcrypt = require('bcryptjs')

const userModel = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                notEmpty: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                notEmpty: true,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                notEmpty: true,
            },
        },
        {
            timestamp: true,
        }
    )

    // Static functions
    User.isEmailTaken = async (email) => {
        const result = await User.findAll({ where: { email } });
        return result?.length > 0
    }

    // Use function original to bind context back from class to local function
    User.prototype.isPasswordMatch = function (password) {
        return bcrypt.compare(password, this.dataValues.password)
    }

    // Hooks
    User.beforeCreate(async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10)
    })

    return User
}

module.exports.userModel = userModel
