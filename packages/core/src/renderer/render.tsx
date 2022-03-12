import { MessageProvider } from "../react/MessageContext"
import { RootNode } from "../nodes"
import { hostConfig } from "./hostConfig"
import ReactReconciler from "react-reconciler"
import type { Client, Message } from "discord.js"
import type { JSX } from "../../jsx-runtime"
import type { ModalRootNode } from "../nodes"

export type RenderFn = (
    Code: () => JSX.Element,
    root: RootNode | ModalRootNode,
    client: Client,
    message: Message
) => void

const reactReconcilerInstance = ReactReconciler(hostConfig)

export const render: RenderFn = (Code, root, client, message) => {
    const rootContainer = reactReconcilerInstance.createContainer(
        root ?? new RootNode(client, message),
        0,
        false,
        null
    )
    reactReconcilerInstance.updateContainer(
        <MessageProvider message={message} client={client}>
            <Code />
        </MessageProvider>,
        rootContainer,
        null
    )
}
