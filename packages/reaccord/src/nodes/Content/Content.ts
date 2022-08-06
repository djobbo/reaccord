import { TextContainerNode } from "../_TextContainer"
import type { RootNode } from "../Root"

export class ContentNode extends TextContainerNode<"Content", RootNode> {
  constructor() {
    super("Content")
  }

  render(): string {
    return this.innerText
  }
}
