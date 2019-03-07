import moment from 'moment'
import * as React from 'react'
import { chats } from '../../db'

const ChatsList = () => (
  <div>
    <ul>
      {chats.map((chat) => (
        <li key={chat.id}>
          <img src={chat.picture} />
          <div>{chat.name}</div>
          {chat.lastMessage && (
            <React.Fragment>
              <div>{chat.lastMessage.content}</div>
              <div>{moment(chat.lastMessage.createdAt).format('HH:mm')}</div>
            </React.Fragment>
          )}
        </li>
      ))}
    </ul>
  </div>
)

export default ChatsList
