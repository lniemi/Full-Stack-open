import { useState } from 'react';
import blogService from '../services/blogs';

const blogForm = ({ setBlogs, blogs, setNotification, setBlogFormVisible }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs([...blogs, createdBlog]);
      setNewBlog({ title: '', author: '', url: '' });
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

  return (
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
        <button type="submit">create</button>
      </form>
        <button onClick={() => setBlogFormVisible(false)}>cancel</button>
    </div>
  );
};

export default blogForm;
