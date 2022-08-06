import { TextContainerNode } from "../_TextContainer"
import type { ContentNode } from "./Content"

export class LinkNode extends TextContainerNode<"Link", ContentNode> {
  constructor() {
    super("Link")
  }

  render(): string {
    if (!this.attr.href || !this.innerText) return ""
    return `[${this.innerText}](${this.attr.href})`
  }
}
