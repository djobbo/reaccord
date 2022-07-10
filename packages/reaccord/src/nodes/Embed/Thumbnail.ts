import { BaseNode } from "../_Base"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class ThumbnailNode extends BaseNode<"thumbnail", EmbedNode> {
    constructor() {
        super("thumbnail")
    }

    render(embed: MessageEmbed): void {
        if (!this.attr.src) return
        embed.setThumbnail(this.attr.src)
    }
}
