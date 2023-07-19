const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  console.log('Token before verification: ', req.token) // Debugging
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    url     :  body.url,
    title   :  body.title,
    author  :  body.author,
    user    :  user._id,
    likes   :  body.likes || 0
  })

  if (!blog.title || !blog.url) {
    return res
      .status(400)
      .json({ error: 'title and url are required' })
      .end()
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(req.params.id)

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(401).json({ error: 'only the creator can delete blogs' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})


blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    title   :  body.title,
    author  :  body.author,
    url     :  body.url,
    likes   :  body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  if (updatedBlog) {
    res.status(204).end()
  }
})

module.exports = blogsRouter
