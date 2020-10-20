con = require('../../config/database/connection')

const routesLogin = require('./routesLogin')

module.exports = (app) => {
    routesLogin(app)
}