import { App } from "./App"
import { DiscordRouter } from "@reaccord/router"
import { client, renderMessage } from "./setupApp"
import { config as loadEnv } from "dotenv"

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

client.on("messageCreate", (message) => {
    const { content, channel } = message

    if (content !== "router") return

    renderMessage(channel, () => (
        <DiscordRouter>
            <App />
        </DiscordRouter>
    ))
})

client.login(process.env.DISCORD_TOKEN)
