import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('title render', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'test.url',
    user: {
      name: 'Test user',
      username: 'testusername',
    },
  }

  render(<Blog blog={blog} user={blog.user} />)

  const element = screen.getByText('Test title', { exact: false })
  expect(element).toBeDefined()
})

test('toggles blog details visibility on "view" button click', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'test.url',
    likes: 5,
    user: {
      name: 'Test user',
      username: 'testusername',
    },
  }

  render(<Blog blog={blog} user={blog.user} />)

  const button = screen.getByText('view')
  await userEvent.click(button)

  const div = screen.getByTestId('togglableContent')
  expect(div).not.toHaveStyle('display: none')
})



test('displays hidden blog elements on "view" button click', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'test.url',
    likes: 5,
    user: {
      name: 'Test user',
      username: 'testusername',
    },
  }

  render(<Blog blog={blog} user={blog.user} />)

  const button = screen.getByText('view')
  await userEvent.click(button)

  const div = screen.getByTestId('togglableContent')
  expect(div).not.toHaveStyle('display: none')

  const urlElement = screen.getByText(blog.url)
  const likesElement = screen.getByText(`likes ${blog.likes}`)
  const userElement = screen.getByText(blog.user.name)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
  expect(userElement).toBeDefined()
})

test('calls handleLike twice when "like" button is clicked twice', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'test.url',
    likes: 5,
    user: {
      name: 'Test user',
      username: 'testusername',
    },
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={blog.user} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)

  const likeButton = screen.getByText('like')

  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})