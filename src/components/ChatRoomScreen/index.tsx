import * as React from 'react'
import { useMemo, useState } from 'react'

const getChatQuery = `
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`

const ChatRoomScreen = ({ match }) => {
  const { params: { chatId } } = match
  const [chat, setChat] = useState(null)

  useMemo(async () => {
    const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getChatQuery,
        variables: { chatId },
      }),
    })
    const { data: { chat } } = await body.json()
    setChat(chat)
  }, [true])

  if (!chat) return null

  return (
    <div>
      <img src={chat.picture} /><div>{chat.name}</div>
      <ul>
        {chat.messages.map((message) =>
          <li key={message.id}>
            <div>{message.content}</div>
            <div>{message.createdAt}</div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ChatRoomScreen
