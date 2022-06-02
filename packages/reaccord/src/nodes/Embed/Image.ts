import { TextContainerNode } from "../_TextContainer"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ImageNode extends TextContainerNode<"img", EmbedNode> {
    constructor() {
        super("img")
    }

    render(embed: Embed): void {
        embed.setImage(this.attr.src ?? null)
    }
}
