import { config as loadEnv } from "dotenv"
import { client, renderMessage } from "./setupApp"
import { App } from './App'

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

client.on("messageCreate", (message) => {
    
    const { content, channel } = message

    if (content !== 'ram') return;
    
    renderMessage(channel, () => <App />)
})

client.login(process.env.DISCORD_TOKEN)
