const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI)
logger.info('Connecting to',config.MONGODB_URI)

app.use(cors())
app.use(express.json())

const router = require('./controllers/blogs')
app.use('/api/blogs',router)


module.exports = app