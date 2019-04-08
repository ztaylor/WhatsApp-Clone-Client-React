import gql from 'graphql-tag'
import * as React from 'react'
import styled from 'styled-components'
import * as fragments from '../../graphql/fragments'
import UsersList from '../UsersList'
import ChatCreationNavbar from './ChatCreationNavbar'

const Container = styled.div `
  height: calc(100% - 56px);
  overflow-y: overlay;
`

const StyledUsersList = styled(UsersList) `
  height: calc(100% - 56px);
`

export default ({ history }) => (
  <div>
    <ChatCreationNavbar history={history} />
    <UsersList />
  </div>
)
