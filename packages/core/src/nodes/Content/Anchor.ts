import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { ContentNode } from "./Content"

export class AnchorNode extends TextContainerNode<"a", ContentNode> {
    constructor() {
        super("a")
    }

    render(): string {
        return `[${this.innerText}](${this.attr.href})`
    }
}

export const isAnchorNode = (node: BaseNode): node is AnchorNode =>
    node instanceof AnchorNode
