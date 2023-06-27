const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
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
  expect(blogs.length).toBe(initialBlogs.length + 1)
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