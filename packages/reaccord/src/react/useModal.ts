import { ModalRootNode } from "../nodes/ModalRoot"
import { render } from "../renderer/render"
import { useMessageCtxInternal } from "./MessageContext"
import type { ButtonInteraction } from "discord.js"
import type { RenderFn } from "../renderer/render"
import type { RootNode } from "../nodes/Root"

const createModal = (
  render: RenderFn,
  code: JSX.Element,
  rootNode: RootNode,
) => {
  const modal = new ModalRootNode(rootNode)
  render(() => code, modal)

  return modal.render()
}

// If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.
const openModal =
  (render: RenderFn, rootNode: RootNode) =>
  (modal: JSX.Element) =>
  (interaction: ButtonInteraction): true => {
    if (!rootNode.message) return true
    interaction.showModal(createModal(render, modal, rootNode))
    return true
  }

export const useModal = () => {
  const { rootNode } = useMessageCtxInternal()

  return { openModal: openModal(render, rootNode) }
}
