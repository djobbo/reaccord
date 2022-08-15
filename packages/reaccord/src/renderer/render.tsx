import { MessageProvider } from "../react/MessageContext"
import { RootNode, isRootNode } from "../nodes/Root"
import { hostConfig } from "./hostConfig"
import ReactReconciler from "react-reconciler"
import type { Client } from "../Client"
import type { InteractionRef, MessageResponseOptions } from "../nodes/Root"
import type { Message } from "discord.js"
import type { ModalRootNode } from "../nodes/ModalRoot"

export type RenderFn = (
  Code: () => JSX.Element,
  root: RootNode | ModalRootNode,
) => void

export type RenderMessageFn = (
  ref: InteractionRef,
  Code: () => JSX.Element,
) => Promise<Message>

export const renderMessage =
  (client: Client, rootOptions: MessageResponseOptions): RenderMessageFn =>
  async (ref, Code) => {
    const root = new RootNode(client, ref, rootOptions)
    render(Code, root)
    return root.updateMessage()
  }

const reactReconcilerInstance = ReactReconciler(hostConfig)
reactReconcilerInstance.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === "production" ? 0 : 1,
  rendererPackageName: "reaccord",
  version: "0.0.0",
})

export const render: RenderFn = (Code, root) => {
  const rootContainer = reactReconcilerInstance.createContainer(
    root,
    0,
    null,
    false,
    null,
    "",
    () => void 0,
    null,
  )

  let timeout: NodeJS.Timeout | undefined

  reactReconcilerInstance.updateContainer(
    <MessageProvider
      rootNode={root.rootNode}
      onInteractionTerminated={() => {
        if (timeout) clearTimeout(timeout)

        reactReconcilerInstance.updateContainer(null, rootContainer, null)
      }}
    >
      <Code />
    </MessageProvider>,
    rootContainer,
    null,
  )

  if (isRootNode(root) && !!root.messageResponseOptions.staleAfter) {
    timeout = setTimeout(() => {
      reactReconcilerInstance.updateContainer(null, rootContainer, null)
      root.resetListeners()
    }, root.messageResponseOptions.staleAfter * 1000)
  }
}
