import { BaseNode } from "./_Base"
import { ContentNode } from "./Content"
import { TextContainerNode } from './_TextContainer'

export class CodeblockNode extends TextContainerNode<"codeblock", ContentNode> {
    constructor() {
        super("codeblock")
    }

    render(): string {
        return `\`\`\`${this.attr.lang}\n${this.innerText}\n\`\`\``
    }
}

export const isCodeblockNode = (node: BaseNode): node is CodeblockNode =>
    node instanceof CodeblockNode
