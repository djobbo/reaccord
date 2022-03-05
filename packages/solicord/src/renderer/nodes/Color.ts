import { BaseNode } from "./_Base"
import { Embed, Colors, Util } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "./_TextContainer"

export class ColorNode extends TextContainerNode<"color", EmbedNode> {
    constructor() {
        super("color")
    }

    render(embed: Embed): void {
        embed.setColor(this.attr.color ? Util.resolveColor(this.attr.color) : Colors.Default)
    }
}

export const isColorNode = (node: BaseNode): node is ColorNode => node instanceof ColorNode
