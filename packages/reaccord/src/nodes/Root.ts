import {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "discord.js"
import { EMPTY_STRING } from "../helpers/constants"
import { Node } from "./Node"
import { debounce } from "../helpers/debounce"
import { isActionRowNode, isEmbedNode } from "./helpers/guards"
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
import type { FileAttachment } from "./elements"

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

export const isRootNode = (node: Node): node is RootNode => node.type === "Root"

export class RootNode extends Node<"Root"> {
  client: Client
  terminateInteraction: () => void = () => void 0
  ref: InteractionRef
  message: Message | null = null
  hydrationHooks: ((message: Message) => void)[] = []
  interactionListeners: Record<string, (interaction: Interaction) => unknown> =
    {}
  files = new Set<FileAttachment>()
  messageResponseOptions: MessageResponseOptions = {
    staleAfter: 5 * 60,
  }

  lastMessageUpdatePromise: Promise<Message> | null = null

  constructor(
    client: Client,
    ref: InteractionRef,
    options: MessageResponseOptions = {},
  ) {
    super(
      "Root",
      // @ts-expect-error: we need to call super() before we can set this.root to this
      null,
    )
    this.rootNode = this

    this.client = client
    this.ref = ref

    this.messageResponseOptions = {
      ...this.messageResponseOptions,
      ...options,
    }

    client.on("interactionCreate", (interaction) => {
      // TODO: Add proper disposal
      if (!this.message) return
      if (
        !interaction.isButton() &&
        !interaction.isSelectMenu() &&
        !interaction.isModalSubmit()
      )
        return

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

  resetListeners() {
    this.interactionListeners = {}
  }

  addFile(file: FileAttachment) {
    this.files.add(file)
  }

  resetFiles() {
    this.files.clear()
  }

  onNodeUpdated(): void {
    this.updateMessage()
  }

  render(): void {
    this.updateMessage()
  }

  addHydrationHook(fn: (message: Message) => void) {
    this.hydrationHooks.push(fn)

    return () => {
      this.hydrationHooks = this.hydrationHooks.filter((hook) => hook !== fn)
    }
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
      // If no message creation request is pending, create a new one
      if (!this.lastMessageUpdatePromise) {
        const createMessageAndHydrate = async () => {
          this.message = await (this.ref instanceof Message
            ? this.ref.reply(messageOptions)
            : this.ref instanceof CommandInteraction ||
              this.ref instanceof ContextMenuCommandInteraction ||
              this.ref instanceof MessageComponentInteraction ||
              this.ref instanceof ModalSubmitInteraction
            ? this.ref.reply({ ...messageOptions, fetchReply: true })
            : this.ref.send(messageOptions))

          if (this.hydrationHooks.length > 0) {
            this.hydrationHooks.forEach((hook) => hook(this.message!))
          }

          return this.message
        }

        this.lastMessageUpdatePromise = createMessageAndHydrate()
        this.message = await this.lastMessageUpdatePromise
        return this.message
      }
      // If a message creation request is pending, wait for it to complete
      this.message = await this.lastMessageUpdatePromise
    }

    if (!this.message) throw new Error("No message to update")

    if (!this.message.editable) throw new Error("Message is not editable")
    this.message.edit(messageOptions)
    return this.message
  }, MESSAGE_UPDATE_DEBOUNCE_MS)
}
