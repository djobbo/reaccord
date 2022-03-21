import { App } from "./App"
import { DiscordRouter, createClient } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const { connect, createCommand } = createClient({
    token: DISCORD_TOKEN ?? "",
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

createCommand("router", "Discord Router example").render(() => (
    <DiscordRouter>
        <App />
    </DiscordRouter>
))

connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
