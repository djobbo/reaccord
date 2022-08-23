import {
  ChatInputCommand,
  MessageContextCommand,
  UserContextCommand,
} from "./Command"
import { Client as DiscordClient } from "discord.js"
import { RootNode } from "./nodes/Root"
import { refreshCommands } from "./refreshCommands"
import { renderMessage } from "./renderer"
import type {
  ClientEvents,
  ClientOptions as DiscordClientOptions,
  Interaction,
} from "discord.js"
import type { MessageResponseOptions } from "./nodes/Root"
import type { ModalRootNode } from "./nodes/ModalRoot"
import type { RenderMessageFn } from "./renderer/render"

type ClientOptions = DiscordClientOptions & {
  token: string
  devGuildId?: string
  clientId?: string
  messageResponseOptions?: MessageResponseOptions
}

export type EventHandler<Event extends keyof ClientEvents> = (
  ...args: ClientEvents[Event]
) => void | Promise<void>

class EventMergerClient extends DiscordClient {
  #eventHandlers: Partial<{
    [Event in keyof ClientEvents]: EventHandler<Event>[]
  }> = {}
  eventDisposers: Partial<{ [Event in keyof ClientEvents]: () => void }> = {}

  constructor(options: DiscordClientOptions) {
    super(options)
  }

  listenTo<Event extends keyof ClientEvents>(
    event: Event,
    handler: EventHandler<Event>,
  ) {
    this.#eventHandlers[event] ??= []
    this.#eventHandlers[event]?.push(handler)

    // Start listening to the event if it's not already listening
    if (!this.eventDisposers[event]) {
      const globalHandler = async (...args: ClientEvents[Event]) => {
        await Promise.all(
          this.#eventHandlers[event]?.map((l) => l(...args)) ?? [],
        )
      }

      super.on(event, globalHandler)

      this.eventDisposers[event] = () => {
        super.off(event, globalHandler)
      }
    }

    return () => this.stopListeningTo(event, handler)
  }

  stopListeningTo<Event extends keyof ClientEvents>(
    event: Event,
    handler: EventHandler<Event>,
  ) {
    // @ts-expect-error weird type error bug?
    this.#eventHandlers[event] =
      this.#eventHandlers[event]?.filter((l) => l !== handler) ?? []

    // Remove the event listener if there are no more listeners
    if (this.#eventHandlers[event]?.length === 0) {
      this.eventDisposers[event]?.()
      delete this.eventDisposers[event]
    }
  }
}

export class Client extends EventMergerClient {
  token: string
  devGuildId?: string
  clientId?: string
  #messageRoots: (RootNode | ModalRootNode)[] = []

  renderMessage: (
    messageResponseOptions?: MessageResponseOptions,
  ) => RenderMessageFn

  chatInputCommands: ChatInputCommand[] = []
  msgCtxCommands: MessageContextCommand[] = []
  userCtxCommands: UserContextCommand[] = []
  #interactionsDisposer?: () => void
  #messageResponseOptions: MessageResponseOptions = {}

  constructor({
    token,
    devGuildId,
    clientId,
    messageResponseOptions,
    ...options
  }: ClientOptions) {
    super(options)

    this.token = token
    this.devGuildId = devGuildId
    this.clientId = clientId

    this.renderMessage = (messageResponseOptions?: MessageResponseOptions) =>
      renderMessage(this, {
        ...this.#messageResponseOptions,
        ...messageResponseOptions,
      })

    this.#listenToInteractions()
  }

  #listenToInteractions() {
    const interactionsHandler = (interaction: Interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.chatInputCommands.find(
          (c) => c.name === interaction.commandName,
        )
        if (!command) return

        command.replyToInteraction(interaction)
      } else if (interaction.isMessageContextMenuCommand()) {
        const command = this.msgCtxCommands.find(
          (c) => c.commandData.name === interaction.commandName,
        )
        if (!command) return

        command.replyToInteraction(interaction)
      } else if (interaction.isUserContextMenuCommand()) {
        const command = this.userCtxCommands.find(
          (c) => c.commandData.name === interaction.commandName,
        )
        if (!command) return

        command.replyToInteraction(interaction)
      }
    }

    this.on("interactionCreate", interactionsHandler)

    this.#interactionsDisposer = () => {
      this.removeListener("interactionCreate", interactionsHandler)
    }

    return this
  }

  async refreshCommands() {
    await refreshCommands(
      this.token,
      [
        ...this.chatInputCommands,
        ...this.msgCtxCommands,
        ...this.userCtxCommands,
      ],
      this.clientId,
      this.devGuildId,
    )

    return this
  }

  async connect(callback: (client: DiscordClient) => void) {
    this.on("ready", callback)
    await this.refreshCommands()
    await this.login(this.token)

    return this
  }

  async disconnect() {
    this.#interactionsDisposer?.()
    this.destroy()
    return this
  }

  registerCommand(
    command: ChatInputCommand | MessageContextCommand | UserContextCommand,
  ) {
    command.setRenderMessageFn(this.renderMessage)

    if (command instanceof ChatInputCommand) {
      this.chatInputCommands.push(command)
    } else if (command instanceof UserContextCommand) {
      this.userCtxCommands.push(command)
    } else if (command instanceof MessageContextCommand) {
      this.msgCtxCommands.push(command)
    }

    return this
  }

  destroy() {
    this.#messageRoots.forEach((root) =>
      root instanceof RootNode ? root.terminateInteraction() : root.clear(),
    )
    this.#messageRoots = []
    super.destroy()
  }

  addMessageRoot(root: RootNode | ModalRootNode) {
    this.#messageRoots.push(root)
    return this
  }
}
