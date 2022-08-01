import { BaseNode } from "../_Base"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ThumbnailNode extends BaseNode<"thumbnail", EmbedNode> {
	constructor() {
		super("thumbnail")
	}

	render(embed: EmbedBuilder): void {
		if (!this.attr.src) return
		embed.setThumbnail(this.attr.src)
	}
}
