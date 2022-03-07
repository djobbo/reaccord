import { BaseNode } from "./_Base"
import { MessageOptions, MessageEditOptions, Client, Interaction } from "discord.js"
import { ContentNode, isContentNode } from "./Content/Content"
import { EmbedNode, isEmbedNode } from "./Embed/Embed"
import { ActionRowNode, isActionRowNode } from "./Interaction/ActionRow"
import { EMPTY_STRING } from "../constants"

export class RootNode extends BaseNode<"root", BaseNode, ContentNode | EmbedNode | ActionRowNode> {
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
        return {
            content:
                this.children
                    .filter(isContentNode)
                    .map((child) => child.render())
                    .at(-1) || EMPTY_STRING,
            embeds: this.children.filter(isEmbedNode).map((child) => child.render()),
            components: this.children.filter(isActionRowNode).map((child) => child.render()),
        }
    }
}

export const isRootNode = (node: BaseNode): node is RootNode => node instanceof RootNode
