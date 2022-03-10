import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { RootNode } from "../Root"

export class ContentNode extends TextContainerNode<"content", RootNode> {
    constructor() {
        super("content")
    }

    render(): string {
        return this.innerText
    }
}
