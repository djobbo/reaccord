import { ChatInputCommand, Client, GatewayIntentBits } from "reaccord"
import { CounterApp } from "./CounterApp"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

// Create end-user command
const counterCommand = new ChatInputCommand("counter", "A simple counter")
  .intParam("start", "Number to start counting from")
  .render(({ start }) => <CounterApp start={start} />)

// Create gateway client
const client = new Client({
  token: DISCORD_TOKEN ?? "",
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: DISCORD_DEV_GUILD_ID,
  clientId: DISCORD_CLIENT_ID,
})

// Register command
client.registerCommand(counterCommand)

// Connect client to gateway
client.connect(() =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
