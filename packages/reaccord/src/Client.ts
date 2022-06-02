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
        // TODO:return disposer
        return () => {}
    }

    onReactionRemoveAll: EventHandler<"messageReactionRemoveAll"> = (
        callback,
        isActive,
    ) => {
        // TODO:return disposer
        return () => {}
    }

    onReactionRemoveEmoji: EventHandler<"messageReactionRemoveEmoji"> = (
        callback,
        isActive,
    ) => {
        // TODO:return disposer
        return () => {}
    }

    onReply: EventHandler<"messageCreate"> = (callback, isActive) => {
        // TODO:return disposer
        return () => {}
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

    createCommand(name: string, description: string) {
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
