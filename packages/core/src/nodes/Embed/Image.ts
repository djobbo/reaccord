import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"

export class ImageNode extends TextContainerNode<"img", EmbedNode> {
    constructor() {
        super("img")
    }

    render(embed: Embed): void {
        embed.setImage(this.attr.src ?? null)
    }
}

export const isImageNode = (node: BaseNode): node is ImageNode => node instanceof ImageNode
