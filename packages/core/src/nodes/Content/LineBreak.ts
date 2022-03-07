import { BaseNode } from "../_Base"
import { ContentNode } from "./Content"
import { TextContainerNode } from '../_TextContainer'

export class LineBreakNode extends TextContainerNode<"code", ContentNode> {
    constructor() {
        super("code")
    }

    render(): string {
        return `\n`
    }
}

export const isLineBreakNode = (node: BaseNode): node is LineBreakNode => node instanceof LineBreakNode
