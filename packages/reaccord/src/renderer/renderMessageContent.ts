import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { assertIsDefined } from "../helpers/asserts"
import { getFileFromAttachment } from "../nodes/helpers/getFileFromAttachment"
import type {
  APIEmbedField,
  EmbedAuthorOptions,
  EmbedFooterOptions,
  Interaction,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  MessageEditOptions,
  MessageOptions,
  ReplyMessageOptions,
} from "discord.js"
import type {
  ActionRowElements,
  EmbedElements,
  FileAttachment,
  FileAttachmentElements,
  ModalElements,
  SelectMenuElements,
  // TextElements, // TODO: [NEXT] TextElements
} from "../jsx"
import type { Node } from "../nodes/Node"
import type { RootNode } from "../nodes/Root"

const EMPTY_STRING = "​"

const renderFileAttachment = (
  node: Node<FileAttachmentElements["file"]>,
): { file: FileAttachment } | null => {
  if ("file" in node.props) {
    if (!node.props.file) return null
    return { file: node.props.file }
  }

  if ("src" in node.props) {
    throw new Error(
      "Image with 'src' not yet supported at root level, use 'file' instead",
    )
  }

  return null
}

const renderEmbedFooter = (
  node: Node<EmbedElements["footer"]>,
): EmbedFooterOptions => {
  return {
    text: node.innerText,
    iconURL: node.props.iconURL,
  }
}

const renderEmbedAuthor = (
  node: Node<EmbedElements["author"]>,
): EmbedAuthorOptions => {
  return {
    name: node.innerText,
    iconURL: node.props.iconURL,
    url: node.props.url,
  }
}

const renderEmbedField = (
  node: Node<EmbedElements["field"]>,
): APIEmbedField => {
  assertIsDefined(node.props.title, "Embed fields must have a title")

  return {
    name: node.props.title,
    value: node.innerText,
    inline: node.props.inline ?? false,
  }
}

const renderEmbedImage = (
  node: Node<EmbedElements["image" | "thumbnail"]>,
): { file?: FileAttachment; filename: string } | null => {
  if ("src" in node.props) {
    if (!node.props.src) return null
    return { filename: node.props.src }
  }

  if ("file" in node.props) {
    if (!node.props.file) return null
    return getFileFromAttachment(node.props.file, node.uuid)
  }

  return null
}

const renderEmbedRoot = (
  node: Node<EmbedElements["root"]>,
): { embed: EmbedBuilder; files: FileAttachment[] } => {
  const embed = new EmbedBuilder({
    url: node.props.url,
  })
    .setTimestamp(node.props.timestamp)
    .setColor(node.props.color ?? null)

  const files: FileAttachment[] = []

  node.children.forEach((child) => {
    switch (child.type) {
      case "reaccord:embed-title":
        const title = child.innerText
        if (title) embed.setTitle(title)
        return
      case "reaccord:embed-description":
        const description = child.innerText
        if (description) embed.setDescription(description)
        return
      case "reaccord:embed-footer":
        const footer = renderEmbedFooter(child)
        if (footer) embed.setFooter(footer)
        return
      case "reaccord:embed-author":
        const author = renderEmbedAuthor(child)
        if (author) embed.setAuthor(author)
      case "reaccord:embed-field":
        const field = renderEmbedField(child)
        embed.addFields(field)
        return
      case "reaccord:embed-image":
        const image = renderEmbedImage(child)
        if (image) {
          embed.setImage(image.filename)
          if (image.file) files.push(image.file)
        }
        return
      case "reaccord:embed-thumbnail":
        const thumbnail = renderEmbedImage(child)
        if (thumbnail) {
          embed.setThumbnail(thumbnail.filename)
          if (thumbnail.file) files.push(thumbnail.file)
        }
      default:
        throw new Error(`Unexpected element type: ${child.type} inside Embed`)
    }
  })

  return { embed, files }
}

const renderActionRowButton = (node: Node<ActionRowElements["button"]>) => {
  const { customId } = node.props

  assertIsDefined(customId, "Button must have a unique customId")

  const button = new ButtonBuilder({
    customId,
    disabled: node.props.disabled ?? false,
    style: node.props.style ?? ButtonStyle.Secondary,
    label: node.innerText,
  })

  const listener = async (interaction: Interaction) => {
    if (!interaction.isButton()) return
    if (interaction.customId !== customId) return

    if (!(await node.props.onClick?.(interaction)))
      await interaction.deferUpdate()
  }

  return { button, customId, listener }
}

const renderActionRowLink = (node: Node<ActionRowElements["link"]>) => {
  return new ButtonBuilder({
    disabled: node.props.disabled ?? false,
    label: node.innerText,
    style: ButtonStyle.Link,
    url: node.props.url,
  })
}

const renderActionRowRoot = (node: Node<ActionRowElements["root"]>) => {
  const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()

  const interactionListeners = new Map<
    string,
    (interaction: Interaction) => unknown
  >()

  node.children.forEach((child) => {
    switch (child.type) {
      case "reaccord:actionrow-button":
        const { button, customId, listener } = renderActionRowButton(child)
        actionRow.addComponents(button)
        interactionListeners.set(customId, listener)
        return
      case "reaccord:actionrow-link":
        const linkButton = renderActionRowLink(child)
        actionRow.addComponents(linkButton)
        return
      default:
        throw new Error(
          `Unexpected element type: ${child.type} inside ActionRow`,
        )
    }
  })

  return { actionRow, interactionListeners }
}

const renderSelectMenuOption = (node: Node<SelectMenuElements["option"]>) => {
  assertIsDefined(node.props.value, "SelectMenu option must have a value")

  return new SelectMenuOptionBuilder({
    default: node.props.default ?? false,
    label: node.innerText,
    value: node.props.value,
    description: node.props.description,
  })
}

const renderSelectMenuRoot = (node: Node<SelectMenuElements["root"]>) => {
  const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()

  const { customId, disabled, placeholder } = node.props

  assertIsDefined(customId, "SelectMenu must have a unique customId")

  const selectMenu = new SelectMenuBuilder({
    customId,
    disabled: disabled ?? false,
    placeholder,
  })

  const options = node.children.map((option) => {
    if (option.type !== "reaccord:selectmenu-option") {
      throw new Error(
        `Unexpected element type: ${option.type} inside SelectMenu`,
      )
    }

    return renderSelectMenuOption(option)
  })

  selectMenu.addOptions(options)

  const listener = async (interaction: Interaction) => {
    if (!interaction.isSelectMenu()) return
    if (interaction.customId !== customId) return

    if (!(await node.props.onChange?.(interaction.values, interaction)))
      interaction.deferUpdate()
  }

  actionRow.addComponents(selectMenu)

  return { actionRow, customId, listener }
}

export const renderMessageContent = (root: RootNode) => {
  const messageContent: MessageOptions &
    MessageEditOptions &
    ReplyMessageOptions &
    InteractionReplyOptions = {
    content: "",
    embeds: [],
    components: [],
    files: [],
  }

  const interactionListeners = new Map<
    string,
    (interaction: Interaction) => unknown
  >()

  root.children.forEach((child) => {
    switch (child.type) {
      case "__text": // TODO: <Span/> | <Br/> etc...
        messageContent.content += child.innerText
        return
      case "reaccord:file-attachment":
      case "reaccord:image-attachment": {
        const fileAttachment = renderFileAttachment(child)
        if (fileAttachment) {
          messageContent.files!.push(fileAttachment.file)
        }
        return
      }
      case "reaccord:embed-root":
        const { embed, files: embedFiles } = renderEmbedRoot(child)
        messageContent.embeds!.push(embed)
        messageContent.files!.push(...embedFiles)
        return
      case "reaccord:actionrow-root": {
        const { actionRow, interactionListeners: actionRowListeners } =
          renderActionRowRoot(child)
        messageContent.components!.push(actionRow)

        actionRowListeners.forEach((listener, customId) => {
          if (interactionListeners.has(customId))
            throw new Error(
              `Interaction listener with customId '${customId}' already exists, customId must be unique`,
            )

          interactionListeners.set(customId, listener)
        })
        return
      }
      case "reaccord:selectmenu-root": {
        const { actionRow, customId, listener } = renderSelectMenuRoot(child)
        messageContent.components!.push(actionRow)
        interactionListeners.set(customId, listener)
        return
      }
      default:
        throw new Error(`Unexpected element type: ${child.type} at root level`)
    }
  })

  if (
    !messageContent.content &&
    (!messageContent.embeds || messageContent.embeds.length === 0) &&
    (!messageContent.files || messageContent.files.length === 0) &&
    (!messageContent.components || messageContent.components.length === 0)
  ) {
    messageContent.content = EMPTY_STRING
  }

  return { messageContent, interactionListeners }
}

const renderModalInput = (node: Node<ModalElements["input"]>) => {
  const actionRow = new ActionRowBuilder<TextInputBuilder>()

  const { name, label, value, placeholder, required, paragraph, onChange } =
    node.props

  assertIsDefined(name, "Modal Input name is required")
  assertIsDefined(label, "Modal Input label is required")

  const textInput = new TextInputBuilder({
    customId: name,
    label: label,
    value: value,
    placeholder: placeholder,
    required: required,
    style: paragraph ? TextInputStyle.Paragraph : TextInputStyle.Short,
  })

  actionRow.addComponents(textInput)

  return { actionRow, name, onChange }
}

export const renderModalWrapper = (node: Node<ModalElements["wrapper"]>) => {
  const { customId, title } = node.props

  assertIsDefined(title, "Modal title is required")
  assertIsDefined(customId, "Modal must have a unique customId")

  const modal = new ModalBuilder({
    customId,
    title,
  })

  const textInputs = node.children.map((child) => {
    if (child.type !== "reaccord:modal-input") {
      throw new Error(`Unexpected element type: ${child.type} inside Modal`)
    }

    return renderModalInput(child)
  })

  modal.addComponents(textInputs.map(({ actionRow }) => actionRow))

  const listener = async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return
    if (interaction.customId !== customId) return

    let props = new Map<string, string>()

    textInputs.map((input) => {
      const customId = input.name
      const value = interaction.fields.getTextInputValue(customId)
      input.onChange?.(value, interaction)
      props.set(input.name, value)
    })

    if (
      !(await node.props.onSubmit?.(Object.fromEntries(props), interaction))
    ) {
      await interaction.deferUpdate()
    }
  }

  return { modal, customId, listener }
}

export const renderModalRoot = (root: Node) => {
  if (root.type !== "reaccord:__modal-root")
    throw new Error("Invalid modal root")

  const modalNode = root.firstChild

  if (
    root.children.length !== 1 ||
    !modalNode ||
    modalNode.type !== "reaccord:modal-wrapper"
  )
    throw new Error(
      "When creating a modal, make sure you wrap all the children inside a single <Modal> element",
    )

  return renderModalWrapper(modalNode)
}
