import { BaseNode } from "./_Base"
import { EMPTY_STRING } from "../helpers/constants"
import {
    isActionRowNode,
    isContentNode,
    isEmbedNode,
    isRootNode,
} from "./guards"
import type { ActionRowNode } from "./Interaction/ActionRow"
import type { ContentNode } from "./Content/Content"
import type { EmbedNode } from "./Embed/Embed"
import type { MessageEditOptions, MessageOptions } from "discord.js"
import type { RootNode } from "./Root"

export class MessageNode extends BaseNode<
    "message",
    RootNode,
    ContentNode | EmbedNode | ActionRowNode
> {
    constructor() {
        super("message")
    }

    render(): MessageOptions | MessageEditOptions {
        if (!this.rootNode || !isRootNode(this.rootNode))
            throw new Error("Message found outside of RootNode")

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
