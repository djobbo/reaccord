import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
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

export const isImageNode = (node: BaseNode): node is ImageNode =>
    node instanceof ImageNode
