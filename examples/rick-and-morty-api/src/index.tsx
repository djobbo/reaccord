import { App } from "./App"
import { ChatInputCommand, Client } from "reaccord"
import { GatewayIntentBits } from "discord.js"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = new Client({
  token: DISCORD_TOKEN ?? "",
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: DISCORD_DEV_GUILD_ID,
  clientId: DISCORD_CLIENT_ID,
})

const queryClient = new QueryClient()

const rickCmd = new ChatInputCommand("rick", "Rick and Morty characters info.")
  .stringParam("search", "Character name search")
  .render(
    ({ search }) => (
      <QueryClientProvider client={queryClient}>
        <App search={search} />
      </QueryClientProvider>
    ),
    { unmountAfter: 300 },
  )

client.registerCommand(rickCmd)

client.connect((client) =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
