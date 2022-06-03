import { Command } from "./Command"
import { Client as DiscordClient } from "discord.js"
import { MessageContextCommand } from "./Command"
import { UserContextCommand } from "./Command"
import { refreshCommands } from "./refreshCommands"
import { render, renderMessage } from "./renderer"
import type {
    ClientOptions as DiscordClientOptions,
    Interaction,
} from "discord.js"
import type { EventHandler, EventListener } from "./react/MessageContext"
import type { RenderMessageFn } from "./renderer/renderMessage"

type ClientOptions = DiscordClientOptions & {
    token: string
    devGuildId?: string
    clientId?: string
}

export class Client extends DiscordClient {
    token: string
    devGuildId?: string
    clientId?: string

    renderMessage: RenderMessageFn

    slashCommands: Command[] = []
    msgCtxCommands: MessageContextCommand[] = []
    userCtxCommands: UserContextCommand[] = []
    commandsDisposer?: () => void

    reactionAddListeners: EventListener<"messageReactionAdd">[] = []
    reactionRemoveListeners: EventListener<"messageReactionRemove">[] = []
    reactionRemoveAllListeners: EventListener<"messageReactionRemoveAll">[] = []
    reactionRemoveEmojiListeners: EventListener<"messageReactionRemoveEmoji">[] =
        []
    replyListeners: EventListener<"messageCreate">[] = []
    reactionAddDisposer?: () => void
    reactionRemoveDisposer?: () => void
    reactionRemoveAllDisposer?: () => void
    reactionRemoveEmojiDisposer?: () => void
    replyDisposer?: () => void

    constructor({ token, devGuildId, clientId, ...options }: ClientOptions) {
        super(options)

        this.token = token
        this.devGuildId = devGuildId
        this.clientId = clientId

        this.renderMessage = renderMessage(render, this)

        this.initInteractions()
    }

    onReactionAdd: EventHandler<"messageReactionAdd"> = (
        callback,
        isActive,
    ) => {
        const handler: EventListener<"messageReactionAdd"> = (...args) => {
            if (!isActive(...args)) return
            callback(...args)
        }
        this.reactionAddListeners.push(handler)

        this.reactionAddDisposer?.()

        const globalHandler: EventListener<"messageReactionAdd"> = (
            ...args
        ) => {
            this.reactionAddListeners.forEach((listener) => listener(...args))
        }

        this.on("messageReactionAdd", globalHandler)

        this.reactionAddDisposer = () => {
            this.removeListener("messageReactionAdd", globalHandler)
        }

        return () => {
            this.reactionAddDisposer?.()
            this.reactionAddListeners = this.reactionAddListeners.filter(
                (listener) => listener !== handler,
            )
        }
    }

    onReactionRemove: EventHandler<"messageReactionRemove"> = (
        callback,
        isActive,
    ) => {
        const handler: EventListener<"messageReactionRemove"> = (...args) => {
            if (!isActive(...args)) return
            callback(...args)
        }
        this.reactionRemoveListeners.push(handler)

        this.reactionAddDisposer?.()

        const globalHandler: EventListener<"messageReactionRemove"> = (
            ...args
        ) => {
            this.reactionRemoveListeners.forEach((listener) =>
                listener(...args),
            )
        }

        this.on("messageReactionRemove", globalHandler)

        this.reactionRemoveDisposer = () => {
            this.removeListener("messageReactionRemove", globalHandler)
        }

        return () => {
            this.reactionRemoveDisposer?.()
            this.reactionRemoveListeners = this.reactionRemoveListeners.filter(
                (listener) => listener !== handler,
            )
        }
    }

    onReactionRemoveAll: EventHandler<"messageReactionRemoveAll"> = (
        callback,
        isActive,
    ) => {
        const handler: EventListener<"messageReactionRemoveAll"> = (
            ...args
        ) => {
            if (!isActive(...args)) return
            callback(...args)
        }
        this.reactionRemoveAllListeners.push(handler)

        this.reactionRemoveAllDisposer?.()

        const globalHandler: EventListener<"messageReactionRemoveAll"> = (
            ...args
        ) => {
            this.reactionRemoveAllListeners.forEach((listener) =>
                listener(...args),
            )
        }

        this.on("messageReactionRemoveAll", globalHandler)

        this.reactionRemoveAllDisposer = () => {
            this.removeListener("messageReactionRemove", globalHandler)
        }

        return () => {
            this.reactionRemoveAllDisposer?.()
            this.reactionRemoveAllListeners =
                this.reactionRemoveAllListeners.filter(
                    (listener) => listener !== handler,
                )
        }
    }

    onReactionRemoveEmoji: EventHandler<"messageReactionRemoveEmoji"> = (
        callback,
        isActive,
    ) => {
        const handler: EventListener<"messageReactionRemoveEmoji"> = (
            ...args
        ) => {
            if (!isActive(...args)) return
            callback(...args)
        }
        this.reactionRemoveEmojiListeners.push(handler)

        this.reactionRemoveEmojiDisposer?.()

        const globalHandler: EventListener<"messageReactionRemoveEmoji"> = (
            ...args
        ) => {
            this.reactionRemoveEmojiListeners.forEach((listener) =>
                listener(...args),
            )
        }

        this.on("messageReactionRemoveEmoji", globalHandler)

        this.reactionRemoveEmojiDisposer = () => {
            this.removeListener("messageReactionRemoveEmoji", globalHandler)
        }

        return () => {
            this.reactionRemoveEmojiDisposer?.()
            this.reactionRemoveEmojiListeners =
                this.reactionRemoveEmojiListeners.filter(
                    (listener) => listener !== handler,
                )
        }
    }

    onReply: EventHandler<"messageCreate"> = (callback, isActive) => {
        const handler: EventListener<"messageCreate"> = (...args) => {
            if (!isActive(...args)) return
            callback(...args)
        }
        this.replyListeners.push(handler)

        this.reactionRemoveEmojiDisposer?.()

        const globalHandler: EventListener<"messageCreate"> = (...args) => {
            this.replyListeners.forEach((listener) => listener(...args))
        }

        this.on("messageCreate", globalHandler)

        this.reactionRemoveEmojiDisposer = () => {
            this.removeListener("messageCreate", globalHandler)
        }

        return () => {
            this.reactionRemoveEmojiDisposer?.()
            this.replyListeners = this.replyListeners.filter(
                (listener) => listener !== handler,
            )
        }
    }

    initInteractions() {
        const init = (interaction: Interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = this.slashCommands.find(
                    (c) => c.name === interaction.commandName,
                )
                if (!command) return

                command.replyToInteraction(interaction)
            } else if (interaction.isMessageContextMenuCommand()) {
                const command = this.msgCtxCommands.find(
                    (c) => c.data.name === interaction.commandName,
                )
                if (!command) return

                command.replyToInteraction(interaction)
            } else if (interaction.isUserContextMenuCommand()) {
                const command = this.userCtxCommands.find(
                    (c) => c.data.name === interaction.commandName,
                )
                if (!command) return

                command.replyToInteraction(interaction)
            }
        }

        this.on("interactionCreate", init)

        this.commandsDisposer = () => {
            this.removeListener("interactionCreate", init)
        }
    }

    async refreshCommands() {
        await refreshCommands(
            this.token,
            this.slashCommands,
            [...this.msgCtxCommands, ...this.userCtxCommands],
            this.clientId,
            this.devGuildId,
        )
    }

    async connect(callback: (client: DiscordClient) => void) {
        this.on("ready", callback)
        await this.refreshCommands()
        await this.login(this.token)
    }

    createSlashCommand(name: string, description: string) {
        const command = new Command(this.renderMessage, { name, description })
        this.slashCommands.push(command)
        return command
    }

    createUserCtxCommand(name: string, defaultPermission?: boolean) {
        const command = new UserContextCommand(
            this.renderMessage,
            name,
            defaultPermission,
        )
        this.userCtxCommands.push(command)
        return command
    }

    createMessageCtxCommand(name: string, defaultPermission?: boolean) {
        const command = new MessageContextCommand(
            this.renderMessage,
            name,
            defaultPermission,
        )
        this.msgCtxCommands.push(command)
        return command
    }
}
