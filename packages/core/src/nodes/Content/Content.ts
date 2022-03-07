import { BaseNode } from "../_Base"
import { RootNode } from "../Root"
import { TextNode } from "../Text"
import { TextContainerNode } from '../_TextContainer'

export class ContentNode extends TextContainerNode<"content", RootNode> {
    constructor() {
        super("content")
    }

    render(): string {
        return this.innerText
    }
}

export const isContentNode = (node: BaseNode): node is ContentNode => node instanceof ContentNode
