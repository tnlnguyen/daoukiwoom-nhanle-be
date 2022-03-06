const httpStatus = require('http-status')
const catchAsync = require('../../utils/catch-async')
const { userService, tokenService } = require('../services')
const ApiError = require('../../utils/api-error')

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body)
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.CREATED).send({ user, tokens })
})

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await userService.login(email, password)
    const tokens = await tokenService.generateAuthTokens(user)
    res.send({ user, tokens })
})

const refreshToken = catchAsync(async (req, res) => {
    const user = await userService.refreshToken(req.body)

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    }
    const token = await tokenService.generateAuthTokens(user?.dataValues)

    res.send({ user, token })
})

const logout = catchAsync(async (req, res) => {
    await userService.logout(req.body.refreshToken)
    res.status(httpStatus.NO_CONTENT).send()
})

const getAll = catchAsync(async (req, res) => {
    const users = await userService.getAll()
    res.send({ users })
})

const deleteUser = catchAsync(async (req, res) => {
    const users = await userService.deleteUser(req.body)
    res.send({ users })
})

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getAll,
    deleteUser,
}
