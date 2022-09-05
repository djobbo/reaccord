import { Counter } from "./Counter"
import { GatewayIntentBits } from "discord.js"
import { createClient, createSlashCommand } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const {
  DISCORD_TOKEN = "",
  DISCORD_DEV_GUILD_ID,
  DISCORD_CLIENT_ID,
} = process.env

// Create end-user command
const counterCommand = createSlashCommand("counter", "A simple counter")
  .intParam("start", "Number to start counting from")
  .render(({ start }) => <Counter start={start} />)

// Create gateway client
const client = createClient({
  token: DISCORD_TOKEN,
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: DISCORD_DEV_GUILD_ID,
  clientId: DISCORD_CLIENT_ID,
  commands: [counterCommand],
})

// Connect client to gateway
client.connect(() =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
