import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const BlogForm = ({ setBlogs, blogs, setNotification, setBlogFormVisible, user }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await blogService.create(newBlog)

      createdBlog.user = {
        username: user.username,
        name: user.name,
        id: user.id
      }
      setBlogs([...blogs, createdBlog])
      setNewBlog({ title: '', author: '', url: '' })
      setNotification({
        message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.error('Error creating blog:', error)
      setNotification({ message: 'Error creating blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            id = "title"
            type="text"
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          author
          <input
            id = "author"
            type="text"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          url
          <input
            id = "url"
            type="text"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <button id= "create-button" type="submit">create</button>
      </form>
      <button onClick={() => setBlogFormVisible(false)}>cancel</button>
    </div>
  )
}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setNotification: PropTypes.func.isRequired,
  setBlogFormVisible: PropTypes.func.isRequired,
}

export default BlogForm
