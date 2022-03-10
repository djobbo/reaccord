import { BaseNode } from "../_Base"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ThumbnailNode extends BaseNode<"thumbnail", EmbedNode> {
    constructor() {
        super("thumbnail")
    }

    render(embed: Embed): void {
        embed.setThumbnail(this.attr.src ?? null)
    }
}
