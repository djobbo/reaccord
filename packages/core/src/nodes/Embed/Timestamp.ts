import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"

export class TimestampNode extends TextContainerNode<"timestamp", EmbedNode> {
    constructor() {
        super("timestamp")
    }

    render(embed: Embed): void {
        embed.setTimestamp(this.attr.timestamp)
    }
}

export const isTimestampNode = (node: BaseNode): node is TimestampNode => node instanceof TimestampNode
