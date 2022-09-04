import { Node } from "./Node"

export const isTextNode = (node: Node): node is TextNode =>
  node.type === "__text"

export class TextNode extends Node {
  #textContent: string = ""

  constructor(textContent: string) {
    super("__text")
    this.#textContent = textContent
  }

  setTextContent(textContent: string) {
    this.#textContent = textContent
  }

  get innerText(): string {
    return this.#textContent
  }
}
