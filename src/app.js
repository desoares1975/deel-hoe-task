const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models/model')
const app = express()
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.use(require('./router'))

module.exports = app
