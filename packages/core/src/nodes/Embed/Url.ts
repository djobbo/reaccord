import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"

export class UrlNode extends TextContainerNode<"url", EmbedNode> {
    constructor() {
        super("url")
    }

    render(embed: Embed): void {
        embed.setURL(this.attr.href ?? null)
    }
}

export const isUrlNode = (node: BaseNode): node is UrlNode => node instanceof UrlNode
