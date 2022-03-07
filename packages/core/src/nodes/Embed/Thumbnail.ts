import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"

export class ThumbnailNode extends BaseNode<"thumbnail", EmbedNode> {
    constructor() {
        super("thumbnail")
    }

    render(embed: Embed): void {
        embed.setThumbnail(this.attr.src ?? null)
    }
}

export const isThumbnailNode = (node: BaseNode): node is ThumbnailNode =>
    node instanceof ThumbnailNode
