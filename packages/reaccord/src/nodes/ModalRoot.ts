import { InteractionType } from "discord.js"
import { Node } from "./Node"
import { isModalNode } from "./helpers/guards"
import type { Client } from "../Client"
import type { Interaction, Message, ModalBuilder } from "discord.js"
import type { RootNode } from "./Root"

export class ModalRootNode extends Node<"ModalRoot"> {
  client: Client
  message: Message

  interactionListeners: Record<string, (interaction: Interaction) => unknown> =
    {}

  constructor(rootNode: RootNode) {
    super("ModalRoot", rootNode)
    this.client = rootNode.client
    this.message = rootNode.message!

    this.client.on("interactionCreate", (interaction) => {
      if (interaction.type !== InteractionType.ModalSubmit) return
      const listener = this.interactionListeners[interaction.customId]
      listener?.(interaction)
    })
  }

  addInteractionListener(
    uuid: string,
    fn: (interaction: Interaction) => unknown,
  ) {
    this.interactionListeners[uuid] = fn
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
