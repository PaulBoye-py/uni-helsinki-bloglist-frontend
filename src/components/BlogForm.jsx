import { useState } from 'react'


const BlogForm = ({ createBlog }) => {

  // Create a new blog
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')


  // Hanlde Blog Creation
  const addBlog =  (e) => {
    e.preventDefault()

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogAuthor('')
    setBlogTitle('')
    setBlogUrl('')
  }


  return (
    <div>
      <h1>create new</h1>

      <form onSubmit={addBlog}>
        <div>
              title
          <input
            name='title'
            value={blogTitle}
            type='text'
            onChange={({ target }) => setBlogTitle(target.value)}
            placeholder='A new Blog'
            data-testid='title'
          />
        </div>

        <div>
              author
          <input
            name='author'
            value={blogAuthor}
            type='text'
            onChange={({ target }) => setBlogAuthor(target.value)}
            placeholder='William Shakespear'
            data-testid='author'
          />
        </div>

        <div>
              url
          <input
            name='url'
            value={blogUrl}
            type='text'
            onChange={({ target }) => setBlogUrl(target.value)}
            placeholder='https://www.new-blog.com'
            data-testid='url'
          />
        </div>

        <button type='submit'>create</button>

      </form>

    </div>
  )
}

export default BlogForm