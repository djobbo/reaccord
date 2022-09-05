<a href="https://djobbo.github.io/reaccord" target="_blank" rel="noreferrer">
  <img src="https://raw.githubusercontent.com/djobbo/reaccord/master/assets/readme_banner.png" alt="Reaccord Banner">
</a>

<div align="center">
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
</div>

Reaccord is a framework for creating discord bots with [react](https://reactjs.org/).  
It is built on top of the [discord.js](https://discord.js.org/) library and is designed to be easy to use.

<a href="https://djobbo.github.io/reaccord" target="_blank" rel="noreferrer">Explore the docs...</a>

</div>

---

Turn your react code into fully featured discord bots **[now](https://djobbo.github.io/reaccord)**!

## Let's build a simple counter

What we will be building:  
<img src="https://raw.githubusercontent.com/djobbo/reaccord/master/assets/simple-counter.gif" alt="Simple Counter">  
_You can view the complete source code [here](https://github.com/djobbo/reaccord/tree/master/examples/simple-counter)._

**Define App behavior**, just like in a React app.

```jsx
const CounterApp = ({ start = 0 }) => {
  const [count, setCount] = useState(start)
  const increment = () => setCount((count) => count + 1)

  return (
    <>
      Count: {count}
      <Button onClick={increment} style={ButtonStyle.Primary}>
        +
      </Button>
    </>
  )
}
```

**Create end-user command.**

```jsx
const counterCommand = new ChatInputCommand("counter", "A simple counter")
  .intParam("start", "Number to start counting from")
  .render(({ start }) => <CounterApp start={start} />)
```

**Instantiate the gateway client**, and register the command.

```jsx
const client = new Client({
  token: "bot-token",
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  devGuildId: "dev-guild-id",
  clientId: "bot-client-id",
})

client.registerCommand(counterCommand)
```

**Connect the client to discord's gateway**

```js
client.connect(() =>
  console.log(`🚀 Client connected as ${client.user?.username}!`),
)
```

<div align="center">

**Congratulations**, now you can go ahead and try your brand new command!

<img src="https://raw.githubusercontent.com/djobbo/reaccord/master/assets/simple-counter.gif" alt="Simple Counter">
</div>

---

<div align="center">
<a href="https://djobbo.github.io/reaccord" target="_blank" rel="noreferrer">Explore the docs...</a>
</div>
