import { BaseNode } from "../_Base"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ColorNode extends BaseNode<"Color", EmbedNode> {
	constructor() {
		super("Color")
	}

	render(embed: EmbedBuilder): void {
		embed.setColor(this.attr.color ?? "Default")
	}
}
