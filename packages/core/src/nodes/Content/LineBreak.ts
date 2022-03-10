import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { ContentNode } from "./Content"

export class LineBreakNode extends TextContainerNode<"code", ContentNode> {
    constructor() {
        super("code")
    }

    render(): string {
        return `\n`
    }
}

export const isLineBreakNode = (node: BaseNode): node is LineBreakNode =>
    node instanceof LineBreakNode
