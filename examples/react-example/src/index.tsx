import {
    Client,
    useMessageCtx,
    useModal,
    useOnReactionAdd,
    useOnReply,
} from "reaccord"
import { config as loadEnv } from "dotenv"
import { useState } from "react"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = new Client({
    token: DISCORD_TOKEN ?? "",
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

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

const App = ({ startCount }: { startCount: number }) => {
    const [count, setCount] = useState(startCount)
    const [emoji, setEmoji] = useState("")
    const [username, setUsername] = useState("")
    const { client, message } = useMessageCtx()
    const { openModal } = useModal()

    useOnReactionAdd((reaction, user) => {
        setEmoji(reaction.emoji.name ?? "")
        setUsername(user.username ?? "")
    }, [])

    useOnReply(
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
                    style={count % 2 === 0 ? "PRIMARY" : "SUCCESS"}
                >
                    Count: {count}
                </button>
                <button onClick={openModal(<Modal />)}>Open Modal</button>
            </action-row>
        </>
    )
}

client
    .createSlashCommand("example", "Show React Example")
    .addInt("count", "Start count")
    .render(({ count }) => <App startCount={count ?? 0} />)

client.connect(() =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
