import { Client } from "discord.js"
import { config as loadEnv } from "dotenv"
import {
    reaccord,
    useMessageCtx,
    useModal,
    useReactionAddEffect,
    useReplyEffect,
} from "@reaccord/core"
import { useState } from "react"

loadEnv()

const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
})

const { renderMessage } = reaccord(client)

client.on("ready", () => console.log("Bot Started!"))

const Modal = () => {
    const { client, message } = useMessageCtx()

    return (
        <modal title={`${client.user?.username}'s Modal`}>
            <modal-row>
                <input
                    label="Hello"
                    onChange={(val) => console.log(val)}
                    value={`hello ${message.id}`}
                />
            </modal-row>
        </modal>
    )
}

const App = () => {
    const [count, setCount] = useState(0)
    const [emoji, setEmoji] = useState("")
    const [username, setUsername] = useState("")
    const { client, message } = useMessageCtx()
    const { openModal } = useModal()

    useReactionAddEffect((reaction, user) => {
        setEmoji(reaction.emoji.name ?? "")
        setUsername(user.username ?? "")
    }, [])

    useReplyEffect(
        (message) => {
            message.react("❤️")
            message.reply(count.toString())
        },
        [count],
        { allowMe: false },
    )

    return (
        <>
            <embed>
                <title>
                    {emoji}
                    Hello
                    {username ?? "from React"}!
                </title>
                <field title="Message">{message.id}</field>
                <field title="Client">{client.user?.username}</field>
            </embed>
            <action-row>
                <button
                    onClick={() => setCount((count) => count + 1)}
                    style={count % 2 === 0 ? "Primary" : "Success"}
                >
                    Count: {count}
                </button>
                <button onClick={openModal(<Modal />)}>Open Modal</button>
            </action-row>
        </>
    )
}

client.on("messageCreate", async (message) => {
    const { content, channel } = message

    if (content !== "r") return
    await renderMessage(channel, () => <App />)
})

client.login(process.env.DISCORD_TOKEN)
