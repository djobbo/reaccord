import { config as loadEnv } from "dotenv"
import { client, renderMessage } from "./setupApp"
import { useState } from "react"

loadEnv()

client.on("ready", () => console.log("Bot Started!"))

const App = () => {
    const [count, setCount] = useState(0)
    const [emoji, setEmoji] = useState("")
    const [username, setUsername] = useState("")

    return (
        <message
            onReactionAdd={(reaction, user) => {
                setEmoji(reaction.emoji.name ?? "")
                setUsername(user.username ?? "")
            }}
            onReply={console.log}
        >
            <embed>
                <title>
                    {emoji && <>{emoji} </>}Hello {username ? <>{username}</> : <>from React</>}!
                </title>
            </embed>
            <action-row>
                <button
                    onClick={() => setCount((count) => count + 1)}
                    style={count % 2 === 0 ? "Primary" : "Success"}
                >
                    Count: {count}
                </button>
            </action-row>
        </message>
    )
}

client.on("messageCreate", async (message) => {
    const { content, channel } = message

    if (content !== "r") return
    await renderMessage(channel, () => <App />)
})

client.login(process.env.DISCORD_TOKEN)
