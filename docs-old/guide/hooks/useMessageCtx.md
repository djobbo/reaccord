# useMessageCtx

## Usage

```tsx
const App = () => {
    const { message, client } = useMessageCtx()

    return <></>
}
```

## MessageContext

The message context contains properties related to the current message.

### client `Client`

The current Discord.js Client being used.

> More info about [Discord.js Client](https://discord.js.org/#/docs/discord.js/stable/class/Client)

### message `Message`

The current message being rendered.

> More info about [Message](https://discord.js.org/#/docs/discord.js/stable/class/Message)
