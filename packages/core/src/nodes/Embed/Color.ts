import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"

export class ColorNode extends BaseNode<"color", EmbedNode> {
    constructor() {
        super("color")
    }

    render(embed: Embed): void {
        embed.setColor(this.attr.color ?? 'Default')
    }
}

export const isColorNode = (node: BaseNode): node is ColorNode => node instanceof ColorNode
