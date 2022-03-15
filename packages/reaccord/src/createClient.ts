import { Client } from "discord.js"
import { Command } from "./Command"
import { MessageContextCommand } from "./Command"
import { UserContextCommand } from "./Command"
import { createRenderer } from "@reaccord/core"
import { refreshCommands as refreshCommandsBase } from "./refreshCommands"
import type { ClientOptions } from "discord.js"

export const createClient = ({
    token,
    devGuildId: devGuildId,
    clientId,
    ...options
}: ClientOptions & {
    token: string
    devGuildId?: string
    clientId?: string
}) => {
    const client = new Client(options)

    const { renderMessage } = createRenderer(client)

    let slashCommands: Command[] = []
    let msgCtxCommands: MessageContextCommand[] = []
    let userCtxCommands: UserContextCommand[] = []

    const refreshCommands = async () => {
        await refreshCommandsBase(
            token,
            slashCommands,
            [...msgCtxCommands, ...userCtxCommands],
            clientId,
            devGuildId,
        )
    }

    const connect = async (callback: (client: Client) => void) => {
        client.on("ready", callback)
        await refreshCommands()
        await client.login(token)
    }

    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = slashCommands.find(
                (c) => c.name === interaction.commandName,
            )
            if (!command) return

            command.replyToInteraction(interaction)
        } else if (interaction.isMessageContextMenuCommand()) {
            const command = msgCtxCommands.find(
                (c) => c.data.name === interaction.commandName,
            )
            if (!command) return

            command.replyToInteraction(interaction)
        } else if (interaction.isUserContextMenuCommand()) {
            const command = userCtxCommands.find(
                (c) => c.data.name === interaction.commandName,
            )
            if (!command) return

            command.replyToInteraction(interaction)
        }
    })

    const createCommand = (name: string, description: string) => {
        const command = new Command(renderMessage, { name, description })
        slashCommands.push(command)
        return command
    }

    const createUserCtxCommand = (
        name: string,
        defaultPermission?: boolean,
    ) => {
        const command = new UserContextCommand(
            renderMessage,
            name,
            defaultPermission,
        )
        userCtxCommands.push(command)
        return command
    }

    const createMessageCtxCommand = (
        name: string,
        defaultPermission?: boolean,
    ) => {
        const command = new MessageContextCommand(
            renderMessage,
            name,
            defaultPermission,
        )
        msgCtxCommands.push(command)
        return command
    }

    return {
        client,
        connect,
        renderMessage,
        refreshCommands,
        createCommand,
        createUserCtxCommand,
        createMessageCtxCommand,
    }
}
