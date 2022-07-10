import { BaseNode } from "../_Base"
import { Util } from "discord.js"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class ColorNode extends BaseNode<"color", EmbedNode> {
    constructor() {
        super("color")
    }

    render(embed: MessageEmbed): void {
        embed.setColor(Util.resolveColor(this.attr.color ?? "DEFAULT"))
    }
}
