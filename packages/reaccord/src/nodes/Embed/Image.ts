import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class ImageNode extends TextContainerNode<"img", EmbedNode> {
    constructor() {
        super("img")
    }

    render(embed: MessageEmbed): void {
        if (!this.attr.src) return
        embed.setImage(this.attr.src)
    }
}
