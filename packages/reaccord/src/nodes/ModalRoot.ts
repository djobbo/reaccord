import { Node } from "./Node"
import { isModalNode } from "./helpers/guards"
import type { ModalBuilder } from "discord.js"
import type { RootNode } from "./Root"

export class ModalRootNode extends Node<"ModalRoot"> {
  constructor(rootNode: RootNode) {
    super("ModalRoot", rootNode)
  }

  render(): ModalBuilder {
    const modalNode = this.firstChild

    if (this.children.length !== 1 || !modalNode || !isModalNode(modalNode))
      throw new Error(
        "When creating a modal, make sure you wrap all the children inside a single <Modal> element",
      )

    return modalNode.render()
  }
}
