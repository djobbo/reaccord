import { BaseNode } from "../_Base"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ThumbNode extends BaseNode<"Thumb", EmbedNode> {
	constructor() {
		super("Thumb")
	}

	render(embed: EmbedBuilder): void {
		if (!this.attr.src) return
		embed.setThumbnail(this.attr.src)
	}
}
