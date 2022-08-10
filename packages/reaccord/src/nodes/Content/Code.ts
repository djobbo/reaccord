import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class CodeNode extends TextContainerNode<"Code", ContentNode> {
  constructor() {
    super("Code")
  }

  render(): string {
    if (!this.innerText) return ""
    return `\`${this.innerText}\``
  }
}
