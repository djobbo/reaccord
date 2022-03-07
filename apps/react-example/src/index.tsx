import { config as loadEnv } from "dotenv"
import { client, renderMessage } from "./setupApp"
import { useState } from "react"

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

const App = () => {
    const [count, setCount] = useState(0)

    return (
        <>
            <embed>
                <title>Hello from React!</title>
            </embed>
            <action-row>
                <button
                    onClick={() => setCount((count) => count + 1)}
                    style={count % 2 === 0 ? "Primary" : "Success"}
                >
                    Count: {count}
                </button>
            </action-row>
        </>
    )
}

client.on("messageCreate", (message) => {
    const { content, channel } = message

    switch (content) {
        case "~react":
            return renderMessage(channel, () => <App />)
        default:
            return
    }
})

client.login(process.env.DISCORD_TOKEN)
