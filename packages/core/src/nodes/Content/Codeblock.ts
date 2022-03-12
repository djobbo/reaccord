import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class CodeblockNode extends TextContainerNode<"codeblock", ContentNode> {
    constructor() {
        super("codeblock")
    }

    render(): string {
        return `\`\`\`${this.attr.lang}\n${this.innerText}\n\`\`\``
    }
}
