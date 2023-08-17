import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
 // const [showAll, setShowAll] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.error("Login error:", exception);
      setNotification({ message: 'Wrong username/password', type: 'error' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
    
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs([...blogs, createdBlog]);
      setNewBlog({ title: '', author: '', url: '' }); // Reset the form fields
      setNotification({ 
        message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`, 
        type: 'success' 
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error("Error creating blog:", error);
      setNotification({ message: 'Error creating blog', type: 'error' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };
  

  //const blogsToShow = showAll
  //  ? blogs
  //  : blogs.filter(blog => blog.important);


  
///////////////////////////////////////////////////////////////////////////////// JSX code

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification?.message} type={notification?.type} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      
      {/* Add Blog Form */}
      <div>
        <h3>create new</h3>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              type="text"
              value={newBlog.title}
              onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={newBlog.author}
              onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newBlog.url}
              onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            />
          </div>
          <button type="submit">Add Blog</button>
        </form>
      </div>

      {/* Toggle Button 
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button> */}

      {/* List of Blogs */}
      <div>
      {blogs.map(blog => (
      <Blog key={blog.id} blog={blog} />
    ))}
      </div>
    </div>
  );
};

export default App;
