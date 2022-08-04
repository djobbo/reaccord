import {
	ActionRow,
	AttachmentBuilder,
	Button,
	ButtonStyle,
	ChatInputCommand,
	Client,
	Content,
	Embed,
	File,
	GatewayIntentBits,
	Thumb,
} from "reaccord"
import {
	QueryClient,
	QueryClientProvider,
	defaultContext,
} from "@tanstack/react-query"
import { Readable } from "stream"
import { config as loadEnv } from "dotenv"
import { renderToImageBuffer, useRenderAttachment } from "@reaccord/canvas"
import { useState } from "react"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

export const CounterApp = ({ start = 0 }: { start?: number }) => {
	const [count, setCount] = useState(start)
	const increment = () => setCount((count) => count + 1)
	const { data: imageFile, isError } = useRenderAttachment(
		["imageFile", count],
		() => (
			<>
				<script src="https://cdn.tailwindcss.com"></script>
				<div className="flex w-full h-full justify-center align-center">
					<h1 className="text-slate-700 font-bold text-4xl pb-1">
						{count}
					</h1>
				</div>
			</>
		),
		{
			viewport: {
				width: 120,
				height: 120,
			},
			queryOptions: {
				keepPreviousData: true,
				// Without this react-query fails to find the current queryClient
				context: defaultContext,
			},
		},
	)

	if (!imageFile) {
		return <Content>Loading...</Content>
	}

	return (
		<>
			<Embed>
				<Thumb src={`attachment://${imageFile.name}`} />
			</Embed>
			<ActionRow>
				<Button onClick={increment} style={ButtonStyle.Primary}>
					+
				</Button>
			</ActionRow>
			{!isError && !!imageFile && <File file={imageFile} />}
		</>
	)
}

const queryClient = new QueryClient()

const counterCommand = new ChatInputCommand("counter", "Counter app").render(
	() => (
		<QueryClientProvider client={queryClient}>
			<CounterApp />
		</QueryClientProvider>
	),
)

const imageGenCommand = new ChatInputCommand(
	"hello",
	"Generate image with react",
)
	.stringParam("message", "Message to display")
	.exec(async ({ message }, interaction) => {
		const imageBuffer = await renderToImageBuffer(
			() => (
				<>
					<html>
						<head>
							<script src="https://cdn.tailwindcss.com"></script>
						</head>
						<body className="p-2">
							<div
								className="w-full h-full bg-slate-200 rounded-lg shadow-md px-20 py-12"
								style={{
									backgroundImage: `url("https://wallpaper.dog/large/20364175.jpg")`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							>
								<div className="bg-slate-100 w-full h-full flex justify-center items-center flex-col rounded-lg  shadow-md">
									<h1 className="text-slate-700 font-bold text-3xl pb-1">
										Hello {interaction.user.username}!
									</h1>
									<p className="text-blue-700">
										{message ?? "reaccord"}
									</p>
								</div>
							</div>
						</body>
					</html>
				</>
			),
			{
				viewport: {
					width: 480,
					height: 240,
				},
			},
		)

		const imageStream = Readable.from(imageBuffer)
		const imageAttachment = new AttachmentBuilder(imageStream)

		interaction.reply({
			files: [imageAttachment],
		})
	})

const client = new Client({
	token: DISCORD_TOKEN ?? "",
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	devGuildId: DISCORD_DEV_GUILD_ID,
	clientId: DISCORD_CLIENT_ID,
})

client.registerCommand(imageGenCommand)
client.registerCommand(counterCommand)

client.connect(() =>
	console.log(`🚀 Client connected as ${client.user?.username}!`),
)
