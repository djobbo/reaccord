import { BaseNode } from "./_Base"
import type { BaseNodeDisplay } from "./_Base"

export class TextNode extends BaseNode<"Text", BaseNode, BaseNode> {
  textContent: string = ""

  constructor(textContent: string) {
    super("Text")
    this.textContent = textContent.toString()
  }

  setTextContent(textContent: string) {
    this.textContent = textContent
    this.onNodeUpdated()
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
