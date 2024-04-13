import { App } from "./App"
import { GatewayIntentBits } from "discord.js"
import { createClient, createSlashCommand } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = createClient({
  token: DISCORD_TOKEN ?? "",
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: DISCORD_DEV_GUILD_ID,
  clientId: DISCORD_CLIENT_ID,
})

const command = createSlashCommand("srv", "Server Components Example")
  .stringParam("search", "Search query", { required: true })
  .render(({ search }) => <App search={search} />, { unmountAfter: 300 })

client.registerCommand(command)

client.connect((client) =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
