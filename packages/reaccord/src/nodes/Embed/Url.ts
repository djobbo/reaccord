import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class UrlNode extends TextContainerNode<"url", EmbedNode> {
    constructor() {
        super("url")
    }

    render(embed: MessageEmbed): void {
        if (!this.attr.href) return
        embed.setURL(this.attr.href)
    }
}
