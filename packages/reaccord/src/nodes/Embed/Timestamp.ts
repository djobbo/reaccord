import { BaseNode } from "../_Base"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class TimestampNode extends BaseNode<"timestamp", EmbedNode> {
    constructor() {
        super("timestamp")
    }

    render(embed: MessageEmbed): void {
        embed.setTimestamp(this.attr.timestamp)
    }
}
