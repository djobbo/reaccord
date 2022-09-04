import { createContext, useContext, useEffect, useReducer } from "react"
import type { Client } from "../Client"
import type { Message } from "discord.js"
import type { RootNode } from "../nodes/Root"

const rootNodeContextInternal = createContext<RootNode>(
  // @ts-expect-error
  null,
)

export const useRootNodeContextInternal = () => {
  const [, forceUpdate] = useReducer(() => ({}), {})
  const rootNode = useContext(rootNodeContextInternal)

  useEffect(() => rootNode.addHydrationHook(forceUpdate), [])

  return rootNode
}

export type MessageContext = {
  client: Client
  /**
   * Message will be `null` on the initial render.
   */
  message: Message | null
  terminateInteraction: () => void
}

export const useMessageCtx = (): MessageContext => {
  const rootNode = useRootNodeContextInternal()

  return {
    client: rootNode.discordClient,
    message: rootNode.message,
    terminateInteraction: rootNode.terminateInteraction,
  }
}

export type MessageProviderProps = {
  rootNode: RootNode
  children?: JSX.Element
}

export const MessageProvider = ({
  rootNode,
  children,
}: MessageProviderProps) => {
  return (
    <rootNodeContextInternal.Provider value={rootNode}>
      {children}
    </rootNodeContextInternal.Provider>
  )
}
