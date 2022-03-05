import { config as loadEnv } from "dotenv"
import { Counter } from "./Counter"
import { TestApp } from "./TestApp"
import { client, renderMessage } from "./setupApp"

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

client.on("messageCreate", (message) => {
    const { content, channel } = message

    switch (content) {
        case "~counter":
            renderMessage(channel, () => <Counter />)
            return
        case "~test":
            renderMessage(channel, () => <TestApp username={message.author.username} />)
        case "~empty":
            renderMessage(channel, () => <embed><field title='​'>Hello</field></embed>)
        default:
            return
    }
})

client.login(process.env.DISCORD_TOKEN)
