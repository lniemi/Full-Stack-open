const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of helper.initialBlogs) {
    let savedBlog = Blog(blog)
    await savedBlog.save()
  }
})

test('the correct number of blogs is returned in json format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(6)
})

test('the database use id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('Posting a blog is working', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      title: 'The BLOG',
      author: 'Timothy Sykes',
      url: 'www.power.com',
      likes: 6,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(response.body.title).toBe('The BLOG')
  expect(response.body.author).toBe('Timothy Sykes')
  expect(response.body.url).toBe('www.power.com')
  expect(response.body.likes).toBe(6)

  const blogs = await Blog.find({})
  expect(blogs.length).toBe(helper.initialBlogs.length + 1)
})

test('Missing likes defaults to 0', async () => {
  const response = await api.post('/api/blogs').send({
    title: 'The BLOG',
    author: 'Timothy Sykes',
    url: 'www.timothysykes.com/blog',
  })
  expect(response.body.likes).toBe(0)
})

test('Missing title or url is bad request', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'New Blog',
      author: 'Timothy Sykes',
      url: 'https://example.com',
      likes: 1,
    })
    .expect(201)

  await api
    .post('/api/blogs')
    .send({
      author: 'Timothy Sykes',
      likes: 1,
    })
    .expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})

test('Deleting a blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('Updating individual blog posts works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogsToUpdate = blogsAtStart[1]
  const updatedBlog = { ...blogsToUpdate, likes : 375284 }
  console.log('updatedBlog is', updatedBlog)

  await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const likes = blogsAtEnd.map(l => l.likes)

  expect(likes[1]).toBe(updatedBlog.likes)
})

afterAll(async () => {
  await mongoose.connection.close()
})