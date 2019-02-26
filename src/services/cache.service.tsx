import { defaultDataIdFromObject } from 'apollo-cache-inmemory'
import * as fragments from '../graphql/fragments'
import * as subscriptions from '../graphql/subscriptions'
import * as queries from '../graphql/queries'
import {
  useChatUpdated,
  useMessageAdded,
  MessageFragment,
  ChatsQuery,
  FullChatFragment,
  UsersQuery,
  useUserAdded,
  useUserUpdated,
  useChatAdded,
} from '../graphql/types'
import { useSubscription } from '../polyfills/react-apollo-hooks'

export const useSubscriptions = () => {
  useChatAdded({
    onSubscriptionData: ({ client, subscriptionData: { data: { chatAdded } } }) => {
      client.writeFragment({
        id: defaultDataIdFromObject(chatAdded),
        fragment: fragments.chat,
        fragmentName: 'Chat',
        data: chatAdded,
      })

      let chats
      try {
        chats = client.readQuery<ChatsQuery>({
          query: queries.chats,
        }).chats
      } catch (e) {}

      if (chats && !chats.some(chat => chat.id === chatAdded.id)) {
        chats.unshift(chatAdded)

        client.writeQuery({
          query: queries.chats,
          data: { chats },
        })
      }
    },
  })

  useChatUpdated({
    onSubscriptionData: ({ client, subscriptionData: { data: { chatUpdated } } }) => {
      client.writeFragment({
        id: defaultDataIdFromObject(chatUpdated),
        fragment: fragments.chat,
        fragmentName: 'Chat',
        data: chatUpdated,
      })
    },
  })

  useMessageAdded({
    onSubscriptionData: ({ client, subscriptionData: { data: { messageAdded } } }) => {
      client.writeFragment<MessageFragment>({
        id: defaultDataIdFromObject(messageAdded),
        fragment: fragments.message,
        data: messageAdded,
      })

      let fullChat
      try {
        fullChat = client.readFragment<FullChatFragment>({
          id: defaultDataIdFromObject(messageAdded.chat),
          fragment: fragments.fullChat,
          fragmentName: 'FullChat',
        })
      } catch (e) {}

      if (fullChat && !fullChat.messages.some(message => message.id === messageAdded.id)) {
        fullChat.messages.push(messageAdded)
        fullChat.lastMessage = messageAdded

        client.writeFragment({
          id: defaultDataIdFromObject(fullChat),
          fragment: fragments.fullChat,
          fragmentName: 'FullChat',
          data: fullChat,
        })
      }

      let chats
      try {
        chats = client.readQuery<ChatsQuery>({
          query: queries.chats,
        }).chats
      } catch (e) {}

      if (chats) {
        const index = chats.findIndex(chat => chat.id === messageAdded.chat.id)
        const chat = chats[index]
        chat.lastMessage = messageAdded
        chats.splice(index, 1)
        chats.unshift(chat)

        client.writeQuery({
          query: queries.chats,
          data: { chats },
        })
      }
    },
  })

  useUserAdded({
    onSubscriptionData: ({ client, subscriptionData: { data: { userAdded } } }) => {
      client.writeFragment({
        id: defaultDataIdFromObject(userAdded),
        fragment: fragments.user,
        data: userAdded,
      })

      let users
      try {
        users = client.readQuery<UsersQuery>({
          query: queries.users,
        }).users
      } catch (e) {}

      if (users && !users.some(user => user.id === userAdded.id)) {
        users.push(userAdded)

        client.writeQuery({
          query: queries.users,
          data: { users },
        })
      }
    },
  })

  useUserUpdated({
    onSubscriptionData: ({ client, subscriptionData: { data: { userUpdated } } }) => {
      client.writeFragment({
        id: defaultDataIdFromObject(userUpdated),
        fragment: fragments.user,
        data: userUpdated,
      })
    },
  })
}
