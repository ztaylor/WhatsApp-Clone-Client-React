import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { cleanup, render, fireEvent, wait, waitForDomChange } from 'react-testing-library'
import ChatsList from './ChatsList'

describe('ChatsList', () => {
  afterEach(() => {
    cleanup()
    window.location.pathname = '/'
  })

  it('renders fetched chats data', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: {
        chats: [
          {
            id: 1,
            name: 'Foo Bar',
            picture: 'https://localhost:4000/picture.jpg',
            lastMessage: {
              id: 1,
              content: 'Hello',
              createdAt: new Date(0),
            },
          },
        ],
      },
    }))

    {
      const { container, getByTestId } = render(<ChatsList />)

      await waitForDomChange({ container })

      expect(getByTestId('name')).toHaveTextContent('Foo Bar')
      expect(getByTestId('picture')).toHaveAttribute('src', 'https://localhost:4000/picture.jpg')
      expect(getByTestId('content')).toHaveTextContent('Hello')
      expect(getByTestId('date')).toHaveTextContent('08:00')
    }
  })

  it('should navigate to the target chat room on chat item click', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      data: {
        chats: [
          {
            id: 1,
            name: 'Foo Bar',
            picture: 'https://localhost:4000/picture.jpg',
            lastMessage: {
              id: 1,
              content: 'Hello',
              createdAt: new Date(0),
            },
          },
        ],
      },
    }))

    const history = createBrowserHistory()

    {
      const { container, getByTestId } = render(<ChatsList history={history} />)

      await waitForDomChange({ container })

      fireEvent.click(getByTestId('chat'))

      await wait(() =>
        expect(history.location.pathname).toEqual('/chats/1')
      )
    }
  })
})
