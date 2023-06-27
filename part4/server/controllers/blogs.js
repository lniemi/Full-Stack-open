const express = require('express')
const Blog = require('../models/blog')

const router = express.Router()

router.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (!blog.title || !blog.url) {
    return res.status(400).end()
  }

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = router