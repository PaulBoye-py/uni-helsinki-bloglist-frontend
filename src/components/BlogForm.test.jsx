import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import Toggable from "./Toggable";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

test('new blog form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const mockHandler = vi.fn()

    render(<Toggable buttonLabel='new blog' ref={mockHandler}>
                <BlogForm createBlog={mockHandler}/>
            </Toggable>)

    const user = userEvent.setup()
    const newBlogButton = screen.getByText('new blog')
    await user.click(newBlogButton)

    const titleInput = screen.getByPlaceholderText('A new Blog')
    const authorInput = screen.getByPlaceholderText('William Shakespear')
    const urlInput = screen.getByPlaceholderText('https://www.new-blog.com')

    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing using Jest')
    await user.type(authorInput, 'Peter Aderoju')
    await user.type(urlInput, 'https://www.paul-roju.me')

    await user.click(sendButton)

    console.log(mockHandler.mock.calls)
    expect(mockHandler.mock.calls).toHaveLength(4)
    expect(mockHandler.mock.calls[3][0].title).toBe('Testing using Jest')

})