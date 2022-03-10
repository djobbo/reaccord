import { BaseNode } from "../_Base"
import { Embed, Util } from "discord.js"
import { EmbedNode } from "./Embed"

export class ColorNode extends BaseNode<"color", EmbedNode> {
    constructor() {
        super("color")
    }

    render(embed: Embed): void {
        embed.setColor(Util.resolveColor(this.attr.color ?? "Default"))
    }
}

export const isColorNode = (node: BaseNode): node is ColorNode =>
    node instanceof ColorNode
