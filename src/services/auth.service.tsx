import { parse as parseCookie } from 'cookie'
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import client from '../client'
import { useCacheService } from './cache.service'

export const withAuth = (Component: React.ComponentType) => {
  return (props) => {
    if (!isSignedIn()) {
      if (props.history.location.pathname === '/sign-in') {
        return null
      }

      return (
        <Redirect to="/sign-in" />
      )
    }

    useCacheService()

    return (
      <Component {...props} />
    )
  }
}

export const signIn = ({ username, password }) => {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/sign-in`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => {
    if (res.status >= 400) {
      return res.text().then(e => Promise.reject(e))
    }
  })
}

export const signOut = () => {
  document.cookie = `authToken=;expires=${new Date(0)}`

  return client.clearStore()
}

export const isSignedIn = () => {
  return /authToken=.+(;|$)/.test(document.cookie)
}