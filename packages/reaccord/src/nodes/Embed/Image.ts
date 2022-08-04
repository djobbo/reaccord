import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ImageNode extends TextContainerNode<"Image", EmbedNode> {
	constructor() {
		super("Image")
	}

	render(embed: EmbedBuilder): void {
		if (!this.attr.src) return
		embed.setImage(this.attr.src)
	}
}
