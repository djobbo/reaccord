import { App } from "./App"
import { Client } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = new Client({
    token: DISCORD_TOKEN ?? "",
    intents: ["Guilds", "GuildMessages"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

client
    .createCommand("rick", "Rick and Morty characters info.")
    .addString("search", "Character name search")
    .render(({ search }) => <App search={search ?? ""} />)

client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
