import { BaseNode } from "../_Base"
import { Util } from "discord.js"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ColorNode extends BaseNode<"color", EmbedNode> {
    constructor() {
        super("color")
    }

    render(embed: EmbedBuilder): void {
        embed.setColor(Util.resolveColor(this.attr.color ?? "Default"))
    }
}
