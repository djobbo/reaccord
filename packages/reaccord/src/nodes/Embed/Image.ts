import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ImageNode extends TextContainerNode<"img", EmbedNode> {
	constructor() {
		super("img")
	}

	render(embed: EmbedBuilder): void {
		if (!this.attr.src) return
		embed.setImage(this.attr.src)
	}
}
