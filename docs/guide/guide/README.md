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
import { createClient } from 'reaccord';
```

**2. Instantiate the client**

```tsx
const { connect, createCommand } = createClient({
    token: 'token',
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: 'dev-guild-id',
    clientId: 'client-id',
})
```

**3. Register our slash command**

```tsx
createCommand("ping", "Ping bot")
    .render(() => (
        <content>Pong</content>
    ))
```

> _**3.bis Respond to interaction directly**_
> ```tsx
> createCommand("ping", "Ping bot")
>     .exec((_, interaction) => {
>         interaction.reply("Pong")
>     })
> ```

**4. Connect the client**
```tsx
connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
);
```

### Complete code

```tsx
import { createClient } from 'reaccord';

const { connect, createCommand } = createClient({
    token: 'token',
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: 'dev-guild-id',
    clientId: 'client-id',
})

createCommand("ping", "Ping bot").render(() => (
    <content>Pong</content>
))

connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
);
```