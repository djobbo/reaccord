import { Client } from "discord.js"
import { solicord } from "solicord"

export const client = new Client({
    intents: ["Guilds", "GuildMessages"],
})

export const { renderMessage, openModal } = solicord(client)
