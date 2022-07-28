# Introduction

Reaccord is a powerful framework to build Discord bots declaratively built on top of React and Discord.js.

## Installation

**Node.js 16.6.0 or newer is required.**

```bash:no-line-numbers
npm install reaccord
yarn add reaccord
pnpm add reaccord
```

## Example

Let's create a `/ping` slash command that will respond `Pong`.

### Step by step

**1. Import `reaccord`**

```tsx
import { Client } from "reaccord"
```

**2. Instantiate the client**

```tsx
const client = createClient({
    token: "token",
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: "dev-guild-id",
    clientId: "client-id",
})
```

**3. Register our slash command**  
_render will respond to the interaction with a message built with react_

```tsx
client
    .createSlashCommand("ping", "Ping bot")
    .render(() => <content>Pong</content>)
```

> _**3.bis Respond to interaction directly**_  
> _exec will allow you to respond to the interaction without needing to return a react component_
>
> ```tsx
> client.createSlashCommand("ping", "Ping bot").exec((_, interaction) => {
>     interaction.reply("Pong")
> })
> ```

**4. Connect the client**

```tsx
client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```

### Complete code

```tsx
import { Client } from "reaccord"

const client = new Client({
    token: "token",
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: "dev-guild-id",
    clientId: "client-id",
})

client
    .createSlashCommand("ping", "Ping bot")
    .render(() => <content>Pong</content>)

client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```
