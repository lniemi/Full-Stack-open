const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).send({ error: 'invalid token' })
  }

  next()
}

const requestLogger = (req, res, next) => {
  logger.info('Method', req.method)
  logger.info('Path', req.path)
  logger.info('Body', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    console.log('Token Extracted: ', req.token) // Debugging
  }
  next()
}

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    console.log('Token Extracted: ', token) // Debugging
    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
      return next(error)
    }
    req.user = decodedToken
    console.log('User Extracted: ', req.user) // Debugging
  }
  next()
}

module.exports = { unknownEndpoint, errorHandler, requestLogger, tokenExtractor, userExtractor }