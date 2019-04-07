import { parse as parseCookie } from 'cookie'
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import client from '../client'
import { useCacheService } from './cache.service'
import gql from 'graphql-tag';

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
  return client.mutate({
    mutation: gql`
      mutation signIn($username: String!, $password: String!) {
        signIn(username: $username, password: $password) {
          id
        }
      }
    `,
    variables: {
      username,
      password
    }
  });
}

export const signOut = () => {
  document.cookie = `authToken=;expires=${new Date(0)}`

  return client.clearStore()
}

export const isSignedIn = () => {
  return /authToken=.+(;|$)/.test(document.cookie)
}