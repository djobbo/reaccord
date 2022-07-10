import { App } from "./App"
import { ChatInputCommand, Client } from "reaccord"
import { DiscordRouter } from "@reaccord/router"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = new Client({
    token: DISCORD_TOKEN ?? "",
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

const routerCmd = new ChatInputCommand(
    "router",
    "Discord Router example",
).render(() => (
    <DiscordRouter>
        <App />
    </DiscordRouter>
))

client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
