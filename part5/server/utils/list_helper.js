const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  const favorite = blogs.find(blog => blog.likes === maxLikes)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = _.countBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: authorWithMostBlogs,
    blogs: authorCounts[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = _.groupBy(blogs, 'author')
  const authorLikeCounts = _.mapValues(authorLikes, (blogs) => _.sumBy(blogs, 'likes'))
  const authorWithMostLikes = _.maxBy(_.keys(authorLikeCounts), (author) => authorLikeCounts[author])

  return {
    author: authorWithMostLikes,
    likes: authorLikeCounts[authorWithMostLikes]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}