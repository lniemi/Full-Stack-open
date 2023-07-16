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

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use('/api/blogs',blogsRouter)
app.use('/api/users',usersRouter)


module.exports = app