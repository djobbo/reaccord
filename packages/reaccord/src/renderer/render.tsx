import { MessageProvider } from "../react/MessageContext"
import { hostConfig } from "./hostConfig"
import { isRootNode } from "../nodes/guards"
import ReactReconciler from "react-reconciler"
import type { Client } from "../Client"
import type { JSX } from "../../jsx-runtime"
import type { Message } from "discord.js"
import type { ModalRootNode, RootNode } from "../nodes"

export type RenderFn = (
    Code: () => JSX.Element,
    root: RootNode | ModalRootNode,
    client: Client,
    message: Message,
) => void

const reactReconcilerInstance = ReactReconciler(hostConfig)

export const render: RenderFn = (Code, root, client, message) => {
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

    reactReconcilerInstance.updateContainer(
        // @ts-expect-error wrong react type??
        <MessageProvider
            message={message}
            client={client}
            onInteractionTerminated={() =>
                reactReconcilerInstance.updateContainer(
                    null,
                    rootContainer,
                    null,
                )
            }
        >
            <Code />
        </MessageProvider>,
        rootContainer,
        null,
    )

    if (isRootNode(root) && !!root.messageResponseOptions.staleAfter) {
        setTimeout(() => {
            reactReconcilerInstance.updateContainer(null, rootContainer, null)
            root.resetListeners()
        }, root.messageResponseOptions.staleAfter * 1000)
    }
}
