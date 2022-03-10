import { Client } from "discord.js"
import { reaccord } from "@reaccord/core"

export const client = new Client({
    intents: ["Guilds", "GuildMessages"],
})

export const { renderMessage } = reaccord(client)
