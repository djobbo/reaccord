import { BaseNode } from "../_Base"
import { ContentNode } from "./Content"
import { TextContainerNode } from '../_TextContainer'

export class CodeNode extends TextContainerNode<"code", ContentNode> {
    constructor() {
        super("code")
    }

    render(): string {
        return `\`${this.innerText}\``
    }
}

export const isCodeNode = (node: BaseNode): node is CodeNode => node instanceof CodeNode
