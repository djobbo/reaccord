import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { ContentNode } from "./Content"

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
