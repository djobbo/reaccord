import { BaseNode } from "../_Base"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class TimestampNode extends BaseNode<"timestamp", EmbedNode> {
    constructor() {
        super("timestamp")
    }

    render(embed: Embed): void {
        embed.setTimestamp(this.attr.timestamp)
    }
}
