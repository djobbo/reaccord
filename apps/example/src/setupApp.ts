import { Client } from "discord.js"
import { reaccord } from "@reaccord/solid"

export const client = new Client({
    intents: ["Guilds", "GuildMessages"],
})

export const { renderMessage, openModal } = reaccord(client)
