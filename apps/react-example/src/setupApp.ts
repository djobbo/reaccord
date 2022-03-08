import { Client } from "discord.js"
import { reaccord } from "@reaccord/react"

export const client = new Client({
    intents: ["Guilds", "GuildMessages", 'GuildMessageReactions'],
})

export const { renderMessage, openModal } = reaccord(client)
