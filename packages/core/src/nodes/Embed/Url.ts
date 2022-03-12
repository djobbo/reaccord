import { TextContainerNode } from "../_TextContainer"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class UrlNode extends TextContainerNode<"url", EmbedNode> {
    constructor() {
        super("url")
    }

    render(embed: Embed): void {
        embed.setURL(this.attr.href ?? null)
    }
}
