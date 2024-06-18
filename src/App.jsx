import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import './App.css'

import Notification from './components/Notification'
import Toggable from './components/Toggable'
import BlogForm from './components/BlogForm'

const App = () => {
  // Blogs
  const [blogs, setBlogs] = useState([])

  // Login
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // State to trigger fetching blogs
  const [fetchTrigger, setFetchTrigger] = useState(false)

  // Notification state
  const [message, setMessage] = useState(null)
  const [showMessage, setShowMessage] = useState(false)


  // Function to set notifications and remove them
  const handleMessage = (message, type, showMessage) => {
    setMessage({ message, type })
    setTimeout(() => {
      setMessage(null)
      setShowMessage(false)
    }, 5000)
    setShowMessage(showMessage)
  }


  // get all blogs from database
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [fetchTrigger]) // Re-fetch blogs when fetchTrigger changes

  // check if the details of a logged in user is already in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  {/* --- START OF LOGIN/OUT OPERATIONS ---*/}

  // handle login form'
  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      // save the user and token to browser's local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      handleMessage(`${user.name} logged in successfully`, 'success', true)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token) // Set token for blogService
    } catch (exception) {
      console.log(exception)
      handleMessage(`${exception.response.data.error}`, 'error', true)
    }
  }

  // Handle Log out
  const handleLogOut = (e) => {
    e.preventDefault()

    let confirmLogOut = window.confirm('Are you sure you want to log out?')
    if (confirmLogOut) {
      window.localStorage.removeItem('loggedBlogappUser')
      handleMessage(`${user.name} logged out!`, 'success', true)
      setUser(null)
      blogService.setToken(null)
    }
  }

  // Login Form
  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <h1>Log in to application</h1>
        </div>
        <div>
            username
          <input
            type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value) }
            data-testid='username'
            placeholder='username'
          />
        </div>

        <div>
            password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            data-testid='password'
            placeholder='********'
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )


  {/* --- START OF BLOG OPERATIONS ---*/}

  // Ref to toggable component
  const blogFormRef = useRef()

  // Hanlde Blog Creation
  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const blog = await blogService.createBlog(newBlog)

      // set the token for the user
      blogService.setToken(user.token)
      setBlogs(blogs.concat(blog))
      handleMessage(`a new blog "${newBlog.title}" by ${newBlog.author} added`, 'success', true)
      setFetchTrigger(!fetchTrigger) // Trigger fetching blogs
    } catch (error) {
      console.log(`Failed to add blog: ${error}`)
      handleMessage('blog creation failed. please try again', 'error', true)
    }
  }

  // Handle Blog Update
  const updateBlog = async (id) => {

    const blog = blogs.find(blog => blog.id === id)
    const updatedBlog = {
      ...blog, likes: blog.likes + 1
    }
    try {
      const retunedBlog = await blogService.updateBlog(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : retunedBlog))
      setFetchTrigger(!fetchTrigger) // Trigger fetching blogs
    } catch (error) {
      handleMessage(`error: ${error}`, 'error', true)
    }
  }

  // Handle Blog Delete
  const deleteBlog = async (id) => {

    const blog = blogs.find(blog => blog.id === id)

    let confirmBlogDeletion = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if(confirmBlogDeletion) {
      try {
        await blogService.deleteBlog(blog.id)
        handleMessage(`Deleted blog ${blog.title} by ${blog.author}`, 'success', true )
        setFetchTrigger(!fetchTrigger) // Trigger fetching blogs

      } catch (error) {
        console.log(`error: ${error}`)
        handleMessage('blog deletion failed. please try again', 'error', true)
      }
    }
  }


  // Display blogs component
  const displayBlogs = () => (
    <div>
      {/* <p>{user.blogs}</p> */}
      {blogs
        // .filter(blog => blog.user && blog.user.username === user.username)
        .filter(blog => blog && blog.likes !== undefined) // Filter out any null or undefined blogs
        .sort((a, b) => b.likes - a.likes) // Sort by number of likes in descending order
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={() => updateBlog(blog.id)}
            deleteBlog={() => deleteBlog(blog.id)}
            user={user}
          />
        )}
    </div>
  )

  {/* --- END OF BLOG OPERATIONS ---*/}

  // Display user details
  const displayUserDetails = () => (
    <div>
      <h1>blogs</h1>
      <p>
        <span>{user.name} logged in</span>
        <button onClick={handleLogOut}>Log out</button>
      </p>
    </div>
  )





  return (
    <div>
      {showMessage && <Notification message={message.message} type={message.type}/>}

      {user === null
        ? loginForm()
        : (
          <div>
            {displayUserDetails()}
            <Toggable buttonLabel='new blog' ref={blogFormRef}>
              <BlogForm createBlog={addBlog}/>
            </Toggable>

            {displayBlogs()}
          </div>
        )
      }
    </div>
  )
}

export default App