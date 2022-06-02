import { BaseNode } from "./_Base"
import type { BaseNodeDisplay } from "./_Base"

export class TextNode extends BaseNode<"textnode", BaseNode, BaseNode> {
    textContent: string = ""

    constructor(textContent: string) {
        super("textnode")
        this.textContent = textContent
    }

    setTextContent(textContent: string) {
        this.textContent = textContent
        this.onNodeRender()
    }

    get display(): BaseNodeDisplay & { textContent: string } {
        return {
            ...super.display,
            textContent: this.textContent,
        }
    }

    render(): string {
        return this.textContent
    }
}
