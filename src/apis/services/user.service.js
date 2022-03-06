const jwt = require('jsonwebtoken')
const ApiError = require('../../utils/api-error')
const httpStatus = require('http-status')

const { database } = require('../models')

const User = database.user
const tokenService = require('./token.service')
const env = require('../../configs/env')

const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    const result = await User.create(userBody)
    return result?.dataValues
}

const login = async (email, password) => {
    const user = await getUserByEmail(email)
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    }
    return user?.dataValues
}

const getUserByEmail = async (email) => {
    return await User.findOne({ where: { email } })
}

const getUserById = async (id) => {
    return await User.findOne({ where: { id } })
}

const logout = async (refreshToken) => {
    const refreshTokenDoc = await tokenService.getTokenByRefresh(refreshToken)
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
    }
    await refreshTokenDoc.remove()
    return true
}

const refreshToken = async (data) => {
    const { refreshToken } = data

    const oldRefresh = await tokenService.getTokenByRefresh(refreshToken)
    const oldRefreshToken = jwt.verify(oldRefresh?.token, env.passport.jwtToken)

    if (!oldRefreshToken || oldRefreshToken.exp < moment().unix()) {
        return null
    }

    const user = await getUserById(oldRefreshToken.sub)

    return user?.dataValues
}

const getAll = async () => {
    return await User.findAll()?.dataValues
}

const deleteUser = async (id) => {
    return await User.destroy({ where: { id } })?.dataValues
}

module.exports = {
    createUser,
    login,
    getUserByEmail,
    refreshToken,
    logout,
    getUserById,
    getAll,
    deleteUser,
}
