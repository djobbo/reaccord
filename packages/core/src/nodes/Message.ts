import { BaseNode } from "./_Base"
import { MessageOptions, MessageEditOptions, Client, Interaction } from "discord.js"
import { ContentNode, isContentNode } from "./Content/Content"
import { EmbedNode, isEmbedNode } from "./Embed/Embed"
import { ActionRowNode, isActionRowNode } from "./Interaction/ActionRow"
import { EMPTY_STRING } from "../constants"

export class MessageNode extends BaseNode<
    "message",
    BaseNode,
    ContentNode | EmbedNode | ActionRowNode
> {
    constructor() {
        super("message")
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

export const isMessageNode = (node: BaseNode): node is MessageNode => node instanceof MessageNode
