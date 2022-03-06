import { config as loadEnv } from "dotenv"
import { Counter } from "./Counter"
import { TestApp } from "./TestApp"
import { client, renderMessage } from "./setupApp"
import { Empty } from "./Empty"

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

client.on("messageCreate", (message) => {
    const { content, channel } = message

    switch (content) {
        case "~counter":
            return renderMessage(channel, () => <Counter />)
        case "~test":
            return renderMessage(channel, () => <TestApp username={message.author.username} />)
        case "~empty":
            return renderMessage(channel, () => (
                <Empty length={Math.floor(Math.random() * 5 + 1)} />
            ))
        default:
            return
    }
})

client.login(process.env.DISCORD_TOKEN)
