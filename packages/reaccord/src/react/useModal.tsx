import { MessageProvider, useRootNodeContextInternal } from "./MessageContext"
import { Node } from "../nodes/Node"
import { renderModalRoot } from "../renderer/renderMessageContent"
import type {
  AutocompleteInteraction,
  Interaction,
  ModalSubmitInteraction,
} from "discord.js"
import type { RootNode } from "../nodes/Root"

const createModal = (Code: () => JSX.Element, root: RootNode) => {
  const modalRoot = new Node("reaccord:__modal-root")

  const rootContainer = root.reconcilerInstance.createContainer(
    modalRoot,
    0,
    null,
    false,
    null,
    "",
    () => void 0,
    null,
  )

  root.reconcilerInstance.updateContainer(
    <MessageProvider rootNode={root}>
      <Code />
    </MessageProvider>,
    rootContainer,
    null,
  )

  return modalRoot
}

// If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.
const openModal =
  (rootNode: RootNode) =>
  <
    T extends Exclude<
      Interaction,
      AutocompleteInteraction | ModalSubmitInteraction
    >,
  >(
    Code: (interaction: T) => JSX.Element,
  ) =>
  (interaction: T): true => {
    if (!rootNode.message) return true
    const modalRoot = createModal(() => Code(interaction), rootNode)
    const { modal, listener } = renderModalRoot(modalRoot)

    rootNode.modalInteractionListener = listener

    interaction.showModal(modal)
    return true
  }

export const useModal = () => {
  const rootNode = useRootNodeContextInternal()

  return { openModal: openModal(rootNode) }
}
