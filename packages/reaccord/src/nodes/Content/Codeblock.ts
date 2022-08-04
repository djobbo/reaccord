import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class CodeblockNode extends TextContainerNode<"CodeBlock", ContentNode> {
	constructor() {
		super("CodeBlock")
	}

	render(): string {
		if (!this.innerText) return ""
		return `\`\`\`${this.attr.lang ?? ""}\n${this.innerText}\n\`\`\``
	}
}
