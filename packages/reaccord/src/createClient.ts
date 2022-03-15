import { Client } from "discord.js"
import { Command } from "./Command"
import { createRenderer } from "@reaccord/core"
import { refreshCommands } from "./refreshCommands"
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

    let commands: Command[] = []

    const connect = async (callback: (client: Client) => void) => {
        client.on("ready", callback)
        await refreshCommands(token, commands, clientId, devGuildId)
        await client.login(token)
    }

    client.on("interactionCreate", (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.find((c) => c.name === interaction.commandName)
        if (!command) return

        command.replyToInteraction(interaction)
    })

    const createCommand = (name: string, description: string) => {
        const command = new Command(renderMessage, { name, description })
        commands.push(command)
        return command
    }

    return {
        client,
        connect,
        renderMessage,
        refreshCommands,
        createCommand,
    }
}
