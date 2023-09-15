import React, { useState } from 'react';

const Blog = ({ blog, handleLike}) => {  
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle}>
      <div> 
        {blog.title} {blog.author} <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>  {/* <-- using handleLike from props */}
          <div>{blog.user?.name}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
