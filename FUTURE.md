# API Future

### React App

```tsx
// Counter.tsx
import { useState } from "reaccord"

type Props = {
    startNumber?: number
}

export const CounterApp = ({ startNumber }: Props) => {
    const [count, setCount] = useState(startNumber)
    const increment = () => setCount((count) => count + 1)

    return (
        <>
            <content>{count}</content>

            <action-row>
                <button onClick={increment} style="Danger">
                    +
                </button>
            </action-row>
        </>
    )
}
```

### Commands

```tsx
// counterCommand.tsx
import { slashCommand } from "reaccord"
import { Counter } from "./Counter"

export const counterCommand = slashCommand("Counter", "A simple counter", {
    staleTime: 300,
})
    .addInt("startCount", "Number to start counting from")
    .render(Counter)
```

### Gateway Client

```tsx
// index.ts
import { createClient } from "reaccord"
import { counterCommand } from "./counterCommand"

const client = new Client({
    token: "token",
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: "dev-guild-id",
    clientId: "client-id",
})

client.registerCommand(counterCommand)

client.connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```

### Launch scripts

```json
// package.json
{
    ...
    scripts: {
        ...
        "dev": "reaccord dev ./index.ts",
        "build": "reaccord build ./index.ts",
        "start": "reaccord ./index.ts"
    },
}
```

### Types

```json
// tsconfig.json
{
    ...
    "compilerOptions": {
        ...
        "jsx": "react-jsx",
        "jsxImportSource": "reaccord"
    },
}
```

or

```tsx
/** @jsx jsx */
import { jsx } from "reaccord"
```
