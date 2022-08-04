import { BaseNode } from "../_Base"
import { EmbedBuilder } from "discord.js"
import type { FieldNode } from "./Field"
import type { RootNode } from "../Root"
import type { ThumbNode } from "./Thumb"
import type { TitleNode } from "../Title"

type EmbedChildren = TitleNode | FieldNode | ThumbNode

export class EmbedNode extends BaseNode<"Embed", RootNode, EmbedChildren> {
	constructor() {
		super("Embed")
	}

	render(): EmbedBuilder {
		const newEmbed = new EmbedBuilder()
		this.children.forEach((child) => child.render(newEmbed))
		return newEmbed
	}
}
