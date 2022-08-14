import { BaseNode } from "./_Base"
import {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "discord.js"
import { EMPTY_STRING } from "../helpers/constants"
import { debounce } from "../helpers/debounce"
import { isActionRowNode } from "./ActionRow"
import { isEmbedNode } from "./Embed"
import { isFileAttachmentNode } from "./FileAttachment"
import type {
  Channel,
  Interaction,
  InteractionReplyOptions,
  MessageEditOptions,
  MessageOptions,
  ReplyMessageOptions,
} from "discord.js"
import type { Client } from "../Client"
import type { FileAttachment } from "./FileAttachment"

export type MessageReactionType =
  | "ADD"
  | "REMOVE"
  | "REMOVE_ALL"
  | "REMOVE_EMOJI"

export type MessageResponseOptions = {
  /**
   * Interactions will not respond after this amount of time (s).
   * @default 300 (5min)
   */
  staleAfter?: number | null
}

export type InteractionRef =
  | Extract<Channel, { send: any }>
  | Message
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MessageComponentInteraction
  | ModalSubmitInteraction

const MESSAGE_UPDATE_DEBOUNCE_MS = 50

export const isRootNode = (node: BaseNode): node is RootNode =>
  node.type === "Root"

export class RootNode extends BaseNode<"Root"> {
  client: Client
  ref: InteractionRef
  message: Message | null = null
  interactionListeners: Record<string, (interaction: Interaction) => unknown> =
    {}
  files = new Set<FileAttachment>()
  messageResponseOptions: MessageResponseOptions = {
    staleAfter: 5 * 60,
  }

  constructor(
    client: Client,
    ref: InteractionRef,
    options: MessageResponseOptions = {},
  ) {
    super("Root")

    this.client = client
    this.ref = ref

    this.messageResponseOptions = {
      ...this.messageResponseOptions,
      ...options,
    }

    client.on("interactionCreate", (interaction) => {
      // TODO: Add proper disposal
      if (!this.message) return
      if (!interaction.isButton() && !interaction.isSelectMenu()) return

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

  resetListeners() {
    this.interactionListeners = {}
  }

  addFile(file: FileAttachment) {
    this.files.add(file)
  }

  resetFiles() {
    this.files.clear()
  }

  render(): void {
    this.updateMessage()
  }

  updateMessage = debounce(async () => {
    this.resetListeners()
    this.resetFiles()

    const messageOptions: MessageOptions &
      MessageEditOptions &
      ReplyMessageOptions &
      InteractionReplyOptions = {
      content: this.innerText,
      embeds: this.children.filter(isEmbedNode).map((child) => child.render()),
      components: this.children
        .filter(isActionRowNode)
        .map((child) => child.render()),
      files: [
        ...this.files,
        ...(this.children
          .filter(isFileAttachmentNode)
          .map((child) => child.render(null))
          .filter(Boolean) as FileAttachment[]),
      ],
    }

    if (
      !messageOptions.content &&
      (!messageOptions.embeds || messageOptions.embeds.length === 0) &&
      (!messageOptions.files || messageOptions.files.length === 0)
    )
      messageOptions.content = EMPTY_STRING

    if (!this.message) {
      this.message =
        this.ref instanceof Message
          ? await this.ref.reply(messageOptions)
          : this.ref instanceof CommandInteraction ||
            this.ref instanceof ContextMenuCommandInteraction ||
            this.ref instanceof MessageComponentInteraction ||
            this.ref instanceof ModalSubmitInteraction
          ? await this.ref.reply({ ...messageOptions, fetchReply: true })
          : await this.ref.send(messageOptions)
      return this.message
    }

    if (!this.message.editable) throw new Error("Message is not editable")
    this.message.edit(messageOptions)
    return this.message
  }, MESSAGE_UPDATE_DEBOUNCE_MS)
}
