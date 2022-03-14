import { App } from "./App"
import { createClient } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const { connect, createCommand } = createClient({
    token: DISCORD_TOKEN ?? "",
    intents: ["Guilds", "GuildMessages"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

createCommand("rick", "Rick and Morty characters info.")
    .stringParam("search", "Character name search")
    .render(({ search }) => <App search={search ?? ""} />)

connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
