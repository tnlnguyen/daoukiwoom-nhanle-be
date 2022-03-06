
const env = require('../configs/env')
const Logger = require('../libs/logger')
const { database } = require("../apis/models");
const log = new Logger(__filename)

module.exports = async () => {
    try {
        await database.sequelize.authenticate()

        log.info('Successfully for MySQL connected!!')
    } catch (err) {
        log.error(`Failed to connect to MySQL - ${err.message}`)
        throw new Error(`Failed to connect to MySQL`)
    }
}
