import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class CodeNode extends TextContainerNode<"code", ContentNode> {
	constructor() {
		super("code")
	}

	render(): string {
		if (!this.innerText) return ""
		return `\`${this.innerText}\``
	}
}
