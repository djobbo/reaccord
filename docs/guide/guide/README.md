# Introduction

Reaccord is a powerful framework to build Discord bot messages declaratively, using React. It is meant to be used in conjonction with discord.js, so that the whole Discord API is available.

## Installation

**Node.js 16.6.0 or newer is required.**

```bash:no-line-numbers
npm install @reaccord/core
yarn add @reaccord/core
pnpm add @reaccord/core
```

## Example

Install required dependencies.

```bash:no-line-numbers
npm install @reaccord/core react discord.js
yarn add @reaccord/core react discord.js
pnpm add @reaccord/core react discord.js
```

Let's create a simple Ping <-> Pong app

```tsx
import { Client } from "discord.js"
import { reaccord } from "@reaccord/core"
import { useState } from "react"

// Create discord.js client
const client = new Client({
    intents: ["Guilds", "GuildMessages"],
})

// Initialize Reaccord
const { renderMessage } = reaccord(client)

// Create a simple message that'll contain 'Pong!'
const Pong = () => {
    return <content>Pong!</content>
}

// Register event
client.on("messageCreate", async (message) => {
    const { content, channel } = message
    if (content !== "!ping") return

    // Send 'Pong!' to the channel
    await renderMessage(channel, () => <Pong />)
})

// Connect your bot
client.login('token')
```