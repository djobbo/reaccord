import { BaseNode } from "./_Base"
import { renderTextNode } from "../renderTextNode"
import { RootNode } from "./Root"
import { TextNode } from "./Text"

export class ContentNode extends BaseNode<"content", RootNode, TextNode> {
    constructor() {
        super("content")
    }

    render(): string {
        return renderTextNode(this.children)
    }
}

export const isContentNode = (node: BaseNode): node is ContentNode => node instanceof ContentNode
