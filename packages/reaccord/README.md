<div style="text-align: center">
    <img src="./assets/reaccord.svg" alt="Reaccord Logo" width="100">
    <h1 style="font-weight: bold">
        <a href="https://djobbo.github.io/reaccord">Reaccord</a>
        <div>
        <a aria-label="reaccord NPM version" href="https://www.npmjs.com/package/reaccord">
            <img alt="" src="https://img.shields.io/npm/v/reaccord.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm&label=reaccord">
        </a>
        <a aria-label="reaccord router NPM version" href="https://www.npmjs.com/package/@reaccord/router">
            <img alt="" src="https://img.shields.io/npm/v/@reaccord/router.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm&label=@reaccord/router">
        </a>
        </div>
    </h1>

A simple, and clean framework to build discord apps declaratively using [React](https://reactjs.org/) + JSX and [Discord.js](https://discord.js.org/).

<a href="https://djobbo.github.io/reaccord" style="font-size: 1.2rem">Explore the docs...</a>

</div>

## Basic Usage

```tsx
import { Client, GatewayIntentBits, ChatInputCommand } from "reaccord"

// Instantiate gateway client
const client = new Client({
    token: "your-discord-token",
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
<img src="./assets/command_ping.png" alt="Ping Command" width="300">

## A few more examples

### `Echo` command with a required string parameter

```tsx
const echo = new ChatInputCommand("echo", "Echoes msg")
    .stringParam("input", "Message to be echoed", { required: true })
    .render(({ input }) => <content>{input}</content>)

client.registerCommand(echo)
```

**Result**  
<img src="./assets/command_echo.png" alt="Echo Command" width="300">

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
<img src="./assets/command_add.png" alt="Add Command" width="250">
