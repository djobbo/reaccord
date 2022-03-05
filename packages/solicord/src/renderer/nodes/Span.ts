import { BaseNode } from "./_Base"
import { ContentNode } from "./Content"
import { TextContainerNode } from './_TextContainer'

export class SpanNode extends TextContainerNode<"span", ContentNode> {
    constructor() {
        super("span")
    }

    render(): string {
        let str = this.innerText
        if (this.attr.italic) str = `_${str}_`
        if (this.attr.bold) str = `**${str}**`
        return str
    }
}

export const isSpanNode = (node: BaseNode): node is SpanNode => node instanceof SpanNode
