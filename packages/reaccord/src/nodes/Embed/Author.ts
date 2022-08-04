import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class AuthorNode extends TextContainerNode<"Author", EmbedNode> {
	constructor() {
		super("Author")
	}

	render(embed: EmbedBuilder): void {
		if (!this.innerText) {
			embed.setAuthor(null)
			return
		}

		embed.setAuthor({
			name: this.innerText ?? EMPTY_STRING,
			iconURL: this.attr.iconURL,
			url: this.attr.url,
		})
	}
}
