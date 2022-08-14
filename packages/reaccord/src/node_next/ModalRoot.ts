import { BaseNode } from "./_Base"
import { InteractionType } from "discord.js"
import { isModalNode } from "./Modal"
import type { Client } from "../Client"
import type { Interaction, Message, ModalBuilder } from "discord.js"

export class ModalRootNode extends BaseNode<"ModalRoot"> {
  client: Client
  message: Message

  interactionListeners: Record<string, (interaction: Interaction) => unknown> =
    {}

  constructor(client: Client, message: Message) {
    super("ModalRoot")
    this.client = client
    this.message = message

    client.on("interactionCreate", (interaction) => {
      if (interaction.type !== InteractionType.ModalSubmit) return
      const listener = this.interactionListeners[interaction.customId]
      listener?.(interaction)
    })
  }

  get rootNode() {
    return this
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
