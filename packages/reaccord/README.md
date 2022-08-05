<div align="center">
    <img src="https://raw.githubusercontent.com/djobbo/reaccord/master/assets/reaccord.svg" alt="Reaccord Logo" width="100">
    <h1 style="font-weight: bold">
        <a href="https://djobbo.github.io/reaccord" target="_blank" rel="noreferrer">Reaccord</a>
        <div>
        <a aria-label="reaccord NPM button" href="https://www.npmjs.com/package/reaccord" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/badge/reaccord--_.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm">
        </a>
        <a aria-label="reaccord router NPM button" href="https://www.npmjs.com/package/@reaccord/router" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/badge/@reaccord/router--_.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm">
        </a>
				<a aria-label="reaccord canvas NPM button" href="https://www.npmjs.com/package/@reaccord/canvas" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/badge/@reaccord/canvas--_.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm">
        </a>
				<!-- Use these shields when non-dev versions of the packages are available -->
        <!-- <a aria-label="reaccord NPM version button" href="https://www.npmjs.com/package/reaccord" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/npm/v/reaccord.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm&label=reaccord">
        </a>
        <a aria-label="reaccord router NPM version button" href="https://www.npmjs.com/package/@reaccord/router" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/npm/v/@reaccord/router.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm&label=@reaccord/router">
        </a>
				<a aria-label="reaccord canvas NPM version button" href="https://www.npmjs.com/package/@reaccord/canvas" target="_blank" rel="noreferrer">
            <img alt="" src="https://img.shields.io/npm/v/@reaccord/canvas.svg?style=flat-square&labelColor=2E3749&color=4596D1&logo=npm&label=@reaccord/canvas">
        </a> -->
        </div>
    </h1>

A simple, and clean framework to build discord apps declaratively using [React](https://reactjs.org/) + JSX and [Discord.js](https://discord.js.org/).

<a href="https://djobbo.github.io/reaccord" target="_blank" rel="noreferrer">Explore the docs...</a>

</div>

## Let's build a simple counter

<img src="https://raw.githubusercontent.com/djobbo/reaccord/master/assets/simple-counter.gif" alt="Simple Counter">

[View complete typescript example here](https://github.com/djobbo/reaccord/tree/master/examples/simple-counter)

**imports**

```jsx
import {
	ActionRow,
	Button,
	ButtonStyle,
	ChatInputCommand,
	Content,
	Client,
} from "reaccord"
import { useState } from "react"
```

**Define App behavior**, just like in a React app.

```jsx
const CounterApp = ({ start = 0 }) => {
	const [count, setCount] = useState(start)
	const increment = () => setCount((count) => count + 1)

	return (
		<>
			<Content>Count: {count}</Content>
			<ActionRow>
				<Button onClick={increment} style={ButtonStyle.Primary}>
					+
				</Button>
			</ActionRow>
		</>
	)
}
```

**Create end-user command.**

```jsx
const counterCommand = new ChatInputCommand("counter", "A simple counter")
	.intParam("start", "Number to start counting from")
	.render(CounterApp)
```

**Instantiate the gateway client**, and register the command.

```jsx
const client = new Client({
	token: DISCORD_TOKEN ?? "",
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	devGuildId: DISCORD_DEV_GUILD_ID,
	clientId: DISCORD_CLIENT_ID,
})

client.registerCommand(counterCommand)

// Connect client to gateway
client.connect(() =>
	console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```
