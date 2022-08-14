import { BaseNode, assertIsNode } from "./_Base"
import type { ReactNode } from "react"

export type TextElements = {
  // TODO: update these
  Br: {}
  Code: {
    children?: ReactNode
  }
  CodeBlock: {
    lang: string //TODO: add some lang suggestions
    children?: ReactNode
    multiline?: boolean
  }
  Span: {
    italic?: boolean
    bold?: boolean
    children?: ReactNode
  }
  Link: {
    href: string
    children?: ReactNode
  }
}

export class TextNode<
  NodeType extends keyof TextElements | "Text" = keyof TextElements | "Text",
> extends BaseNode<NodeType> {
  textContent?: string

  constructor(type: NodeType, textContent?: string) {
    super(type)

    this.textContent = textContent
  }

  setTextContent(textContent: string): void {
    this.textContent = textContent
  }

  render(): string {
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
}

export const isTextNode = (node: BaseNode): node is TextNode =>
  node instanceof TextNode
