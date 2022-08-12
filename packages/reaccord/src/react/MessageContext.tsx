import { createContext, useContext } from "react"
import type { Client } from "../Client"
import type { Message } from "discord.js"
import type { ModalRootNode, RootNode } from "../nodes"

export type MessageContext = {
  client: Client
  /**
   * Message will be `null` on the initial render.
   */
  message: Message | null
  terminateInteraction: () => void
}

const messageContext = createContext<MessageContext>({
  message: null,
  // @ts-expect-error
  client: null,
})

export const useMessageCtx = () => useContext(messageContext)

export type MessageProviderProps = {
  rootNode: RootNode | ModalRootNode
  children?: JSX.Element
  onInteractionTerminated: () => void
}

export const MessageProvider = ({
  rootNode,
  children,
  onInteractionTerminated,
}: MessageProviderProps) => {
  return (
    <messageContext.Provider
      value={{
        client: rootNode.client,
        message: rootNode.message,
        terminateInteraction: onInteractionTerminated,
      }}
    >
      {children}
    </messageContext.Provider>
  )
}
