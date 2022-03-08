import { BaseNode } from "./_Base"
import { MessageOptions, MessageEditOptions, Client, Interaction } from "discord.js"
import { ContentNode, isContentNode } from "./Content/Content"
import { EmbedNode, isEmbedNode } from "./Embed/Embed"
import { ActionRowNode, isActionRowNode } from "./Interaction/ActionRow"
import { EMPTY_STRING } from "../constants"
import { RootNode } from "./Root"

export class MessageNode extends BaseNode<
    "message",
    BaseNode,
    ContentNode | EmbedNode | ActionRowNode
> {
    constructor() {
        super("message")
    }

    render(): MessageOptions | MessageEditOptions {
        if (!(this.rootNode instanceof RootNode))
            throw new Error("Message found outside of RootNode")

        if (this.attr.onReactionAdd)
            this.rootNode.addReactionListener("ADD", this.attr.onReactionAdd)
        if (this.attr.onReactionRemove)
            this.rootNode.addReactionListener("REMOVE", this.attr.onReactionRemove)
        if (this.attr.onReactionRemoveAll)
            this.rootNode.addReactionListener("REMOVE_ALL", this.attr.onReactionRemoveAll)
        if (this.attr.onReactionRemoveEmoji)
            this.rootNode.addReactionListener("REMOVE_EMOJI", this.attr.onReactionRemoveEmoji)

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
