import { Node } from "./Node"
import { assertIsNode } from "./helpers/assertIsNode"
import type { RootNode } from "./Root"
import type { TextElements } from "./elements"

export class TextNode<
  NodeType extends keyof TextElements | "Text" = keyof TextElements | "Text",
> extends Node<NodeType> {
  textContent?: string

  constructor(type: NodeType, rootNode: RootNode, textContent?: string) {
    super(type, rootNode)

    this.textContent = textContent
  }

  setTextContent(textContent: string): void {
    this.textContent = textContent
  }

  renderAsText(): string {
    switch (this.type) {
      case "Text":
        return this.textContent ?? ""
      case "Br":
        return "\n"
      case "Code":
        return `\`${this.innerText}\``
      case "CodeBlock":
        assertIsNode(this, "CodeBlock")
        return `\`\`\`${this.props.lang ?? ""}\n${this.innerText}\n\`\`\``
      case "Span":
        assertIsNode(this, "Span")
        let str = this.innerText
        if (!str) return ""

        if (this.props.italic) str = `_${str}_`
        if (this.props.bold) str = `**${str}**`
        return str
      case "Link":
        assertIsNode(this, "Link")
        return `[${this.innerText}](${this.props.href})`
      default:
        throw new Error(`Unknown text node type: ${this.type}`)
    }
  }

  render(): string {
    return this.renderAsText()
  }
}
