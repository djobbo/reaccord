import { BaseNode } from "../_Base"
import { RootNode } from "../Root"
import { getFileFromAttachment } from "../../helpers/getFileFromAttachment"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class ThumbNode extends BaseNode<"Thumb", EmbedNode> {
	constructor() {
		super("Thumb")
	}

	render(embed: EmbedBuilder): void {
		if ("src" in this.attr) {
			if (!this.attr.src) return
			embed.setImage(this.attr.src)
			return
		}

		if ("file" in this.attr) {
			if (!this.attr.file) return
			if (!(this.rootNode instanceof RootNode))
				throw new Error("Root node not found")

			const { file, filename } = getFileFromAttachment(
				this.attr.file,
				this.uuid,
			)

			this.rootNode.addFile(file)
			embed.setImage(filename)
		}
	}
}
