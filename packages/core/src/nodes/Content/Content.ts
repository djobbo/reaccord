import { BaseNode } from "../_Base"
import { RootNode } from "../Root"
import { TextContainerNode } from "../_TextContainer"
import { TextNode } from "../Text"

export class ContentNode extends TextContainerNode<"content", RootNode> {
    constructor() {
        super("content")
    }

    render(): string {
        return this.innerText
    }
}

export const isContentNode = (node: BaseNode): node is ContentNode =>
    node instanceof ContentNode
