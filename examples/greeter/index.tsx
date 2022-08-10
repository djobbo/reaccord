import {
  ActionRow,
  Button,
  ChatInputCommand,
  Client,
  Color,
  Content,
  Embed,
  GatewayIntentBits,
  Title,
} from "reaccord"
import { CanvasImage } from "@reaccord/canvas"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const greetingCommand = new ChatInputCommand("greet", "Greet me!").render(
  (_, interaction) => (
    <>
      <Content>{interaction.user.toString()}, welcome!</Content>
      <Embed>
        <Title>I am a bot designed to greet you!</Title>
        <Color color="Orange" />
        <CanvasImage id="greeting" width={320} height={80}>
          <script src="https://cdn.tailwindcss.com"></script>
          <div className="bg-gray-800 w-screen h-screen flex justify-center items-center">
            <h1 className="text-lg font-bold text-white">
              Hello {interaction.user.username}!
            </h1>
          </div>
        </CanvasImage>
      </Embed>
      <ActionRow>
        <Button
          onClick={() => {
            interaction.channel?.send("Hello!")
          }}
        >
          Say Hello!
        </Button>
      </ActionRow>
    </>
  ),
)

const client = new Client({
  token: DISCORD_TOKEN ?? "",
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: DISCORD_DEV_GUILD_ID,
  clientId: DISCORD_CLIENT_ID,
})

client.registerCommand(greetingCommand)

client.connect(() =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
