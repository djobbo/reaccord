# Reaccord

A simple, and clean framework to build discord apps declaratively using [React](https://reactjs.org/) + JSX and [Discord.js](https://discord.js.org/).

## Usage

```tsx
import { Client } from "reaccord"

// Create client
const client = new Client({
    token: "token",
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
    devGuildId: "dev-guild-id",
    clientId: "client-id",
})

// Create a simple `ping` command
const ping = new ChatInputCommand("ping", "Ping").render(() => (
    <content>Pong</content>
))

// Register the command
client.registerCommand(ping)

// Connect client
client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```

**Result**  
<img src="./assets/images/command_ping.png" alt="Ping Command" width="300">

## A few more examples

### `Echo` command with a required string parameter

```tsx
const echo = new ChatInputCommand("echo", "Echoes msg")
    .stringParam("input", "Message to be echoed", { required: true })
    .render(({ input }) => <content>{input}</content>)

client.registerCommand(echo)
```

**Result**  
<img src="./assets/images/command_echo.png" alt="Echo Command" width="300">

### `Add` command with two optional number parameters

```tsx
const add = new ChatInputCommand("add", "Add two numbers")
    .numberParam("a", "First number")
    .numberParam("b", "Second number")
    .render(({ a = 0, b = 0 }) => (
        <embed>
            <title>Result: {a + b}</title>
            <desc>
                {a} + {b}
            </desc>
        </embed>
    ))

client.registerCommand(add)
```

**Result**  
<img src="./assets/images/command_add.png" alt="Add Command" width="250">
