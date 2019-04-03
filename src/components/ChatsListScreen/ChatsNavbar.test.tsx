import { createMemoryHistory } from 'history'
import React from 'react'
import { cleanup, render, fireEvent, wait } from 'react-testing-library'
import ChatsNavbar from './ChatsNavbar'

describe('ChatsNavbar', () => {
  afterEach(cleanup)

  it('navigates to /sign-in on click', async () => {
    const history = createMemoryHistory()

    {
      const { container, getByTestId } = render(<ChatsNavbar history={history} />)
      const signOutButton = getByTestId('sign-out-button') as HTMLButtonElement

      fireEvent.click(signOutButton)

      await wait(() =>
        expect(history.location.pathname).toEqual('/sign-in')
      )
    }
  })
})
