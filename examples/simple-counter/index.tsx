import {
  ActionRow,
  Button,
  ButtonStyle,
  ChatInputCommand,
  Client,
  Content,
  GatewayIntentBits,
} from "reaccord"
import { config as loadEnv } from "dotenv"
import { useState } from "react"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)
  const increment = () => setCount((count) => count + 1)

  return (
    <>
      <Content>Count: {count}</Content>
      <ActionRow>
        <Button onClick={increment} style={ButtonStyle.Primary}>
          +
        </Button>
      </ActionRow>
    </>
  )
}

// Create end-user command
const counterCommand = new ChatInputCommand("counter", "A simple counter")
  .intParam("start", "Number to start counting from")
  .render(CounterApp)

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
