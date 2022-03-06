const jwt = require('jsonwebtoken')
const moment = require('moment')

const { database } = require('../models')
const Token = database.token

const env = require('../../configs/env')
const { tokenTypes } = require('../../configs/enum')

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(env.passport.jwtAccessExpired / 60, 'minutes')
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS)

    const refreshTokenExpires = moment().add(env.passport.jwtRefreshExpired / 60, 'minutes')
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH)
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    }
}

const generateToken = (userId, expires, type, secret = env.passport.jwtToken) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    }
    return jwt.sign(payload, secret)
}

const getTokenByRefresh = async (refreshToken) => {
    const refreshTokenDoc = await Token.findAll({
        token: refreshToken,
        type: tokenTypes.REFRESH,
    })
    return refreshTokenDoc?.dataValues
}

const saveToken = async (token, userId, expires, type) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
    })
    return tokenDoc?.dataValues
}

module.exports = {
    generateAuthTokens,
    generateToken,
    getTokenByRefresh,
}
