import { BaseNode } from "./_Base"
import { EMPTY_STRING } from "../helpers/constants"
import { RootNode } from "./Root"
import { isActionRowNode } from "./Interaction/ActionRow"
import { isContentNode } from "./Content/Content"
import { isEmbedNode } from "./Embed/Embed"
import type { ActionRowNode } from "./Interaction/ActionRow"
import type { ContentNode } from "./Content/Content"
import type { EmbedNode } from "./Embed/Embed"
import type { MessageEditOptions, MessageOptions } from "discord.js"

export class MessageNode extends BaseNode<
    "message",
    RootNode,
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
            this.rootNode.addReactionListener(
                "REMOVE",
                this.attr.onReactionRemove
            )
        if (this.attr.onReactionRemoveAll)
            this.rootNode.addReactionListener(
                "REMOVE_ALL",
                this.attr.onReactionRemoveAll
            )
        if (this.attr.onReactionRemoveEmoji)
            this.rootNode.addReactionListener(
                "REMOVE_EMOJI",
                this.attr.onReactionRemoveEmoji
            )
        if (this.attr.onReply) this.rootNode.addReplyListener(this.attr.onReply)

        return {
            content:
                this.children
                    .filter(isContentNode)
                    .map((child) => child.render())
                    .at(-1) || EMPTY_STRING,
            embeds: this.children
                .filter(isEmbedNode)
                .map((child) => child.render()),
            components: this.children
                .filter(isActionRowNode)
                .map((child) => child.render()),
        }
    }
}

export const isMessageNode = (node: BaseNode): node is MessageNode =>
    node instanceof MessageNode
