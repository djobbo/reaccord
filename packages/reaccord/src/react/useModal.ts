import { ModalRootNode } from "../nodes/Interaction/ModalRoot"
import { render } from "../renderer/render"
import { useMessageCtx } from "./MessageContext"
import type { ButtonInteraction, Message } from "discord.js"
import type { Client } from "../Client"
import type { RenderFn } from "../renderer/render"

const createModal = (
  render: RenderFn,
  client: Client,
  code: JSX.Element,
  message: Message,
) => {
  const modal = new ModalRootNode(client)
  render(() => code, modal, client, message)

  return modal.render()
}

// If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.
const openModal =
  (render: RenderFn, client: Client, message: Message) =>
  (modal: JSX.Element) =>
  (interaction: ButtonInteraction): true => {
    interaction.showModal(createModal(render, client, modal, message))
    return true
  }

export const useModal = () => {
  const { client, message } = useMessageCtx()

  return { openModal: openModal(render, client, message) }
}
