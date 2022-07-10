import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class AnchorNode extends TextContainerNode<"a", ContentNode> {
    constructor() {
        super("a")
    }

    render(): string {
        if (!this.attr.href || !this.innerText) return ""
        return `[${this.innerText}](${this.attr.href})`
    }
}
