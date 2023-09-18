import React, { useState } from 'react'

const Blog = ({ blog, handleLike, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }



  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div data-testid="togglableContent">
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button id="like-button" onClick={handleLike}>like</button></div>
          <div>{blog.user?.name}</div>

          {/* Show Delete button only for the user who added the blog */}
          {user && blog.user && user.username === blog.user.username && (
            <button id="delete-button" onClick={() => deleteBlog(blog)}>Delete</button>
          )}

        </div>
      )}
    </div>
  )
}
export default Blog
