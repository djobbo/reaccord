import { MessageProvider } from "../react/MessageContext"
import { RootNode, isRootNode } from "../nodes/Root"
import { hostConfig } from "./hostConfig"
import ReactReconciler from "react-reconciler"
import type { Client } from "../Client"
import type { InteractionRef, MessageResponseOptions } from "../nodes/Root"
import type { Message } from "discord.js"
import type { ModalRootNode } from "../nodes/ModalRoot"

export type RenderFn = (
  Code: () => JSX.Element, //TODO:  | Promise<JSX.Element>
  root: RootNode | ModalRootNode,
) => void

export type RenderMessageFn = (
  ref: InteractionRef,
  Code: () => JSX.Element,
) => Promise<Message>

export const renderMessage =
  (
    client: Client,
    rootOptions: MessageResponseOptions,
    forcedNode?: RootNode,
  ): RenderMessageFn =>
  async (ref, Code) => {
    const root = forcedNode ?? new RootNode(client, ref, rootOptions)
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

  if (isRootNode(root)) {
    let timeout: NodeJS.Timeout | undefined

    root.terminateInteraction = () => {
      if (timeout) clearTimeout(timeout)

      reactReconcilerInstance.updateContainer(null, rootContainer, null)
      root.resetListeners()
      root.clear()
    }

    if (!!root.messageResponseOptions.staleAfter) {
      timeout = setTimeout(() => {
        root.terminateInteraction()
      }, root.messageResponseOptions.staleAfter * 1000)
    }
  } else {
    root.terminateInteraction = () => {
      reactReconcilerInstance.updateContainer(null, rootContainer, null)
      root.clear()
    }
  }

  root.rootNode.client.addMessageRoot(root)

  reactReconcilerInstance.updateContainer(
    <MessageProvider rootNode={root.rootNode}>
      <Code />
    </MessageProvider>,
    rootContainer,
    null,
  )
}
