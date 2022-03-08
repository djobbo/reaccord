import { BaseNode } from "./_Base"
import { MessageOptions, MessageEditOptions, Client, Interaction } from "discord.js"
import { isMessageNode, MessageNode } from './Message'

export class RootNode extends BaseNode<"root", BaseNode, MessageNode> {
    client: Client
    onRender: ((node: RootNode) => void) | undefined
    listeners: Record<string, (interaction: Interaction) => unknown> = {}

    constructor(client: Client, onRender?: (node: RootNode) => void | undefined) {
        super("root")
        this.client = client
        this.onRender = onRender

        client.on("interactionCreate", (interaction) => {
            if (!interaction.isButton() && !interaction.isSelectMenu()) return
            interaction
            const listener = this.listeners[interaction.customId]
            listener?.(interaction)
        })
    }

    onNodeRender() {
        this.onRender?.(this)
    }

    get rootNode() {
        return this
    }

    addListener(uuid: string, fn: (interaction: Interaction) => unknown) {
        this.listeners[uuid] = fn
    }

    removeListener(uuid: string) {
        delete this.listeners[uuid]
    }

    render(): MessageOptions | MessageEditOptions {
        const messageNode = this.firstChild
        if (this.children.length !== 1 || !messageNode || !isMessageNode(messageNode))
            throw new Error("root should only have one child, a <message> node")
        return messageNode.render()
    }
}

export const isRootNode = (node: BaseNode): node is RootNode => node instanceof RootNode
