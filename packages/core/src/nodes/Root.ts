import { BaseNode } from "./_Base"
import { isMessageNode } from "./guards"
import type {
    Client,
    Interaction,
    Message,
    MessageEditOptions,
    MessageOptions,
} from "discord.js"
import type { MessageNode } from "./Message"

export type MessageReactionType =
    | "ADD"
    | "REMOVE"
    | "REMOVE_ALL"
    | "REMOVE_EMOJI"

export class RootNode extends BaseNode<"root", BaseNode, MessageNode> {
    client: Client

    onRender: ((node: RootNode) => void) | undefined

    interactionListeners: Record<
        string,
        (interaction: Interaction) => unknown
    > = {}

    message: Message

    constructor(
        client: Client,
        message: Message,
        onRender?: (node: RootNode) => void | undefined,
    ) {
        super("root")
        this.client = client
        this.message = message
        this.onRender = onRender

        client.on("interactionCreate", (interaction) => {
            // TODO: Add proper disposal
            if (!interaction.isButton() && !interaction.isSelectMenu()) return
            interaction
            const listener = this.interactionListeners[interaction.customId]
            listener?.(interaction)
        })
    }

    onNodeRender() {
        this.onRender?.(this)
    }

    get rootNode() {
        return this
    }

    addInteractionListener(
        uuid: string,
        fn: (interaction: Interaction) => unknown,
    ) {
        this.interactionListeners[uuid] = fn
    }

    resetListeners() {
        this.interactionListeners = {}
    }

    render(): MessageOptions | MessageEditOptions {
        this.resetListeners()
        const messageNode = this.firstChild
        if (
            this.children.length !== 1 ||
            !messageNode ||
            !isMessageNode(messageNode)
        )
            throw new Error("root should only have one child, a <message> node")
        return messageNode.render()
    }
}
