import { TextContainerNode } from "./_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed/Embed"

export class TitleNode extends TextContainerNode<"Title", EmbedNode> {
	constructor() {
		super("Title")
	}

	render(embed: EmbedBuilder): void {
		embed.setTitle(this.innerText)
	}
}
