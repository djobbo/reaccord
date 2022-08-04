import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class BrNode extends TextContainerNode<"Br", ContentNode> {
	constructor() {
		super("Br")
	}

	render(): string {
		return `\n`
	}
}
