import { defaultDataIdFromObject } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'
import * as React from 'react'
import { useCallback } from 'react'
import { useApolloClient, useQuery, useMutation } from 'react-apollo-hooks'
import styled from 'styled-components'
import ChatNavbar from './ChatNavbar'
import MessageInput from './MessageInput'
import MessagesList from './MessagesList'
import { useGetChatQuery, useAddMessageMutation } from '../../graphql/types'
import * as queries from '../../graphql/queries'
import * as fragments from '../../graphql/fragments'

const Container = styled.div `
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`

const getChatQuery = gql `
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${fragments.fullChat}
`

const addMessageMutation = gql `
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      ...Message
    }
  }
  ${fragments.message}
`

const ChatRoomScreen = ({ history, match }) => {
  const { params: { chatId } } = match
  const client = useApolloClient()
  const { data: { chat } } = useGetChatQuery({
    variables: { chatId }
  })
  const addMessage = useAddMessageMutation()

  const onSendMessage = useCallback((content) => {
    addMessage({
      variables: { chatId, content },
      optimisticResponse: {
        __typename: 'Mutation',
        addMessage: {
          __typename: 'Message',
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          content,
        }
      },
      update: (client, { data: { addMessage } }) => {
        let fullChat
        try {
          fullChat = client.readFragment({
            id: defaultDataIdFromObject(chat),
            fragment: fragments.fullChat,
            fragmentName: 'FullChat',
          })
        } catch (e) {
          return
        }

        if (fullChat.messages.some(m => m.id === message.id)) return

        fullChat.messages.push(addMessage)
        fullChat.lastMessage = addMessage

        client.writeFragment({
          id: defaultDataIdFromObject(chat),
          fragment: fragments.fullChat,
          fragmentName: 'FullChat',
          data: fullChat,
        })

        rewriteChats:
        {
          let data
          try {
            data = client.readQuery({
              query: queries.chats,
            })
          } catch (e) {
            break rewriteChats
          }

          if (!data) break rewriteChats

          const chats = data.chats

          if (!chats) break rewriteChats

          const chatIndex = chats.findIndex(c => c.id === chatId)

          if (chatIndex === -1) break rewriteChats

          const chat = chats[chatIndex]

          // The chat will appear at the top of the ChatsList component
          chats.splice(chatIndex, 1)
          chats.unshift(chat)

          client.writeQuery({
            query: queries.chats,
            data: { chats: chats },
          })
        }
      },
    })
  }, [chat])

  if (!chat) return null

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      <MessagesList messages={chat.messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  )
}

export default ChatRoomScreen
