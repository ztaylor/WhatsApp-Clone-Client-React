import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import * as React from 'react'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

const Container = styled(Toolbar) `
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: var(--primary-bg);
  color: var(--primary-text);
`

const BackButton = styled(Button) `
  svg {
    color: var(--primary-text);
  }
`

const Picture = styled.img `
  height: 40px;
  width: 40px;
  margin-top: 3px;
  margin-left: -22px;
  object-fit: cover;
  padding: 5px;
  border-radius: 50%;
`

const Name = styled.div `
  line-height: 56px;
`

const ChatNavbar = ({ chat, history }) => {
  const navBack = useCallback(() => {
    history.replace('/chats')
  }, [true])

  return (
    <Container className={name}>
      <BackButton data-testid="back-button" onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      <Picture data-testid="chat-picture" src={chat.picture} />
      <Name data-testid="chat-name">{chat.name}</Name>
    </Container>
  )
}

export default ChatNavbar
