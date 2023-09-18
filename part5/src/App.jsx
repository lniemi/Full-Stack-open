import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/blogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Login error:', exception)
      setNotification({ message: 'Wrong username/password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const updateBlogLikes = async blog => {
    try {
      const { user, ...blogWithoutUser } = blog
      const updatedBlog = await blogService.update(blog.id, {
        ...blogWithoutUser,
        likes: blog.likes + 1,
      })
      const updatedBlogWithUser = {
        ...updatedBlog,
        user: blog.user,
      }
      setBlogs(prevBlogs => {
        const updatedBlogs = prevBlogs.map(prevBlog =>
          prevBlog.id === updatedBlogWithUser.id
            ? updatedBlogWithUser
            : prevBlog
        )
        return updatedBlogs
      })

      setUpdateTrigger(prevTrigger => prevTrigger + 1)
    } catch (error) {
      console.log('Error updating likes', error)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        //setBlogs(blogs); previous exercise
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [updateTrigger])


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification?.message} type={notification?.type} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id = 'username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id = 'password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button'type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {/* Add Blog Form */}
      <button onClick={() => setBlogFormVisible(true)}>Add New Blog</button>
      {blogFormVisible && <BlogForm user={user} setBlogs={setBlogs} blogs={blogs} setNotification={setNotification} setBlogFormVisible={setBlogFormVisible} />}

      {/* List of Blogs */}
      <div>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} handleLike={() => updateBlogLikes(blog)} deleteBlog={deleteBlog} user={user} />
        ))}
      </div>
    </div>
  )
}

export default App
