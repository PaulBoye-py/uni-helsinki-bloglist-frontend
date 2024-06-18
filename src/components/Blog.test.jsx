import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

test(`component displaying a blog renders the blog's title and author,`, () => {
    const blog = {
        title: 'Testing using vitest',
        author: 'Paul Aderoju',
        likes: 5,
        url: 'www.vitest.com'
    }

    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} onClick={mockHandler}/>)
    const div = container.querySelector('.always-visible')


    expect(div).toHaveTextContent('Testing using vitest')
    expect(div).toHaveTextContent('Paul Aderoju')
    expect(div).not.toHaveTextContent(5)
    expect(div).not.toHaveTextContent('www.vitest.com')
})

test(`blog's URL and number of likes are shown when the button controlling the shown details has been clicked`, async () => {
    const blog = {
        title: 'Testing using vitest',
        author: 'Paul Aderoju',
        likes: 5,
        url: 'www.vitest.com',
        user: {
            name: 'Paul Ade'
        }
    } 

    const mockHandler = vi.fn()

    const { container } = render (
                                    <Blog blog={blog} onClick={mockHandler}/>
                                )

    const user = userEvent.setup()
    const showMoreButton = screen.getByText('view')
    await user.click(showMoreButton)

    const div = container.querySelector('.click-visible')
    expect(div).toHaveTextContent('www.vitest.com')
    expect(div).toHaveTextContent(5)
})

test(`like button clicled twice calls props twice`, async () => {
    const blog = {
        title: 'Testing using vitest',
        author: 'Paul Aderoju',
        likes: 5,
        url: 'www.vitest.com',
        user: {
            name: 'Paul Ade'
        }
    } 
    
    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} onClick={mockHandler}/>)

    const user = userEvent.setup()
    const showMoreButton = screen.getByText('view')
    await user.click(showMoreButton)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

