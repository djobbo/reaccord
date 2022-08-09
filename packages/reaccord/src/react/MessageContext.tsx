import { createContext, useContext } from "react"
import type { Client } from "../Client"
import type { Message } from "discord.js"

export type MessageContext = {
  client: Client
  message: Message
  terminateInteraction: () => void
}

const messageContext = createContext<MessageContext>({
  // @ts-expect-error
  message: null,
  // @ts-expect-error
  client: null,
})

export const useMessageCtx = () => useContext(messageContext)

export type MessageProviderProps = {
  client: Client
  message: Message
  children?: JSX.Element
  onInteractionTerminated: () => void
}

export const MessageProvider = ({
  children,
  client,
  message,
  onInteractionTerminated,
}: MessageProviderProps) => {
  return (
    <messageContext.Provider
      value={{
        client,
        message,
        terminateInteraction: onInteractionTerminated,
      }}
    >
      {children}
    </messageContext.Provider>
  )
}
