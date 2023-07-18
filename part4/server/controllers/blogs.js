const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const user = await User.findOne()
  const blog = new Blog({
    ...req.body,
    user: user._id
  })

  if (!blog.title || !blog.url) {
    return res.status(400).end()
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

router.put('/:id', async (req, res) => {
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

module.exports = router