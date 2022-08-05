import { CanvasImage } from "@reaccord/canvas"
import { ChatInputCommand, Client, Content, GatewayIntentBits } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const greetingCommand = new ChatInputCommand(
	"greet",
	"Generate image with react",
).render((_, interaction) => (
	<>
		<Content>{interaction.user.toString()}, welcome!</Content>
		<CanvasImage id="greeting" width={320} height={80}>
			<script src="https://cdn.tailwindcss.com"></script>
			<div className="bg-gray-800 w-screen h-screen flex text-center items-center">
				<h1 className="text-xl text-white ml-16">
					Hello {interaction.user.username}!
				</h1>
				<img
					src={
						interaction.user.avatarURL() ??
						interaction.user.defaultAvatarURL
					}
					className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-lg absolute z-10"
					style={{
						top: "50%",
						left: 0,
						transform: "translate(-50%, -50%)",
					}}
				/>
			</div>
		</CanvasImage>
	</>
))

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
