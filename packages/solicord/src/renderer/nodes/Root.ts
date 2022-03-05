import { BaseNode } from "./_Base"
import { MessageOptions, MessageEditOptions, Client } from "discord.js"
import { ContentNode, isContentNode } from "./Content"
import { EmbedNode, isEmbedNode } from "./Embed"
import { ActionRowNode, isActionRowNode } from "./ActionRow"
import { ModalRootNode } from './ModalRoot'

export class RootNode extends BaseNode<"root", BaseNode, ContentNode | EmbedNode | ActionRowNode> {
    client: Client
    onRender: ((node: RootNode) => void) | undefined

    constructor(
        client: Client,
        onRender?: (node: RootNode) => void | undefined,
    ) {
        super("root")
        this.client = client
        this.onRender = onRender
    }

    onNodeRender() {
        this.onRender?.(this)
    }

    get rootNode() {
        return this
    }

    render(): MessageOptions | MessageEditOptions {
        return {
            content:
                this.children
                    .filter(isContentNode)
                    .map((child) => child.render())
                    .at(-1) || "​",
            embeds: this.children.filter(isEmbedNode).map((child) => child.render()),
            components: this.children.filter(isActionRowNode).map((child) => child.render()),
        }
    }
}

export const isRootNode = (node: BaseNode): node is RootNode => node instanceof RootNode
