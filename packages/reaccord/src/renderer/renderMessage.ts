import { RootNode } from "./RootNode"
import { hostConfig } from "./hostConfig"
import createReconciler from "react-reconciler"
import type { Client, MessageRenderOptions } from "../Client"
import type { InteractionRefType } from "./RootNode"

const reactReconcilerInstance = createReconciler(hostConfig)
reactReconcilerInstance.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === "development" ? 1 : 0,
  rendererPackageName: "reaccord",
  version: "0.0.0",
})

export const renderMessage = (
  Code: () => JSX.Element,
  discordClient: Client,
  ref: InteractionRefType,
  rootOptions?: MessageRenderOptions,
) => {
  const root = new RootNode(
    discordClient,
    reactReconcilerInstance,
  ).replyToInteraction(ref, Code, rootOptions)
  return root
}
