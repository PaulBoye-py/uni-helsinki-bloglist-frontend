import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleVisibility = () => {
    setVisible(!visible)
    setButtonLabel(visible ? 'view' : 'hide')
  }


  const fullDetails = () => (
    <div className='click-visible'>
      {blog.url} <br/>
      {blog.likes} <button onClick={updateBlog} className='like-button'>like</button> <br/>
      {blog.user.name} <br />

      {/* Only the user who created the blog can delete it */}
      {blog.user && blog.user.username === user.username ? 
        <button onClick={deleteBlog}>remove</button> 
        : null}
    </div>
  )

  return (
    <div style={blogStyle} className='always-visible'>
      {blog.title} {blog.author} <button onClick={handleVisibility}>{buttonLabel}</button><br/>
      {visible && fullDetails()}
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}
export default Blog