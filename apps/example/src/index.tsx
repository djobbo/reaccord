import { config as loadEnv } from "dotenv"

import { solicord } from "solicord"
import { createSignal } from "solid-js"
import { Client } from "discord.js"

loadEnv()

const client = new Client({
    intents: ["Guilds", "GuildMessages"],
})

const { renderMessage, openModal } = solicord(client)

const MyModal = ({ myAwesomeFn }: { myAwesomeFn: (value: string) => void }) => {
    const [text, setText] = createSignal("")

    return (
        <modal title="My Modal" onSubmit={() => console.log("submit xd")}>
            <modal-row>
                <input onChange={myAwesomeFn} label="BRUH" />
            </modal-row>
            <modal-row>
                <input
                    onChange={(newText) => setText(newText)}
                    value={text()}
                    label={text() || "Enter text lol"}
                    large
                />
            </modal-row>
        </modal>
    )
}

const App = ({username}: {username: string}) => {
    const [count, setCount] = createSignal(0)
    const [name, setName] = createSignal(username)

    return (
        <>
            <embed>
                <title>Hi {name()}</title>
                <field title="Field">
                    Field
                    {/* <a href="https://google.com">Google</a> */}
                </field>
            </embed>
            <content>
                Hello
                {/* <codeblock lang="js">console.log('{count()}')</codeblock>
                <code>xd</code>
                <span bold>Bold</span>
                <span italic>Italic</span>
                <span bold italic>
                    BoldItalic
                </span>
                <br /> */}
            </content>
            <action-row>
                <button
                    id="add"
                    style="Danger"
                    onClick={() => {
                        setCount((count) => count - 1)
                    }}
                >
                    -
                </button>
                <button style="Secondary" disabled>
                    {count()}
                </button>
                <button
                    id="substract"
                    style="Success"
                    onClick={() => {
                        setCount((count) => count + 1)
                    }}
                >
                    +
                </button>
            </action-row>
            <action-row>
                <button
                    id="add"
                    style="Secondary"
                    onClick={openModal(<MyModal myAwesomeFn={(newName) => setName(newName)} />)}
                >
                    Open Modal
                </button>
            </action-row>
        </>
    )
}

client.on("ready", () => console.log("Bot Started!"))

client.on("messageCreate", (message) => {
    const { content, channel } = message
    if (content !== "a") return

    renderMessage(channel, () => <App username={message.author.username}/>)
})

client.login(process.env.DISCORD_TOKEN)
