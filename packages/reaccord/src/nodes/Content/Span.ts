import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class SpanNode extends TextContainerNode<"Span", ContentNode> {
	constructor() {
		super("Span")
	}

	render(): string {
		let str = this.innerText
		if (!str) return ""

		if (this.attr.italic) str = `_${str}_`
		if (this.attr.bold) str = `**${str}**`
		return str
	}
}
