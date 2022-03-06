const Logger = require('./libs/logger')

const bannerLogger = require('./libs/banner')

const expressLoader = require('./loaders/expressLoader')
const sequelizeLoader = require('./loaders/sequelizeLoader')
const swaggerLoader = require('./loaders/swaggerLoader')
const winstonLoader = require('./loaders/winstonLoader')
const log = new Logger(__filename)

// Init loaders
async function initApp() {
    // logging
    winstonLoader()

    // Database
    await sequelizeLoader()

    // express
    const app = expressLoader()

    // swagger
    swaggerLoader(app)
}

initApp()
    .then(() => bannerLogger(log))
    .catch((error) => log.error('Application is crashed: ' + error))
