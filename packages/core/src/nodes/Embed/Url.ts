import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
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

export const isUrlNode = (node: BaseNode): node is UrlNode =>
    node instanceof UrlNode
