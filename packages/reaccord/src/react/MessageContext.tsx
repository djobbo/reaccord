import { createContext, useContext } from "react"
import type { Client } from "../Client"
import type { Message } from "discord.js"
import type { RootNode } from "../nodes/Root"

export type MessageContext = {
  client: Client
  /**
   * Message will be `null` on the initial render.
   */
  message: Message | null
  rootNode: RootNode
  terminateInteraction: () => void
}

const messageContext = createContext<MessageContext>({
  message: null,
  // @ts-expect-error
  client: null,
  // @ts-expect-error
  rootNode: null,
  terminateInteraction: () => void 0,
})

export const useMessageCtx = () => {
  const { rootNode, ...publicCtx } = useContext(messageContext)
  return publicCtx
}

export const useMessageCtxInternal = () => useContext(messageContext)

export type MessageProviderProps = {
  rootNode: RootNode
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
        rootNode,
        client: rootNode.client,
        message: rootNode.message,
        terminateInteraction: onInteractionTerminated,
      }}
    >
      {children}
    </messageContext.Provider>
  )
}
