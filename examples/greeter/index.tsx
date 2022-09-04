import { ActionRow, ChatInputCommand, Client, Embed } from "reaccord"
import { CanvasImage } from "@reaccord/canvas"
import { GatewayIntentBits } from "discord.js"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const greetingCommand = new ChatInputCommand("greet", "Greet me!").render(
  (_, interaction) => (
    <>
      {interaction.user.toString()}, welcome!
      <Embed color="Orange">
        <Embed.Title>I am a bot designed to greet you!</Embed.Title>
        <CanvasImage
          id={["greeting", interaction.user.username]}
          width={320}
          height={80}
          placeholderUrl="https://via.placeholder.com/320x80"
        >
          <script src="https://cdn.tailwindcss.com"></script>
          <div className="bg-gray-800 w-screen h-screen flex justify-center items-center">
            <h1 className="text-lg font-bold text-white">
              Hello {interaction.user.username}!
            </h1>
          </div>
        </CanvasImage>
      </Embed>
      <ActionRow>
        <ActionRow.Button
          customId="greet"
          onClick={() => {
            interaction.channel?.send("Hello!")
          }}
        >
          Say Hello!
        </ActionRow.Button>
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
