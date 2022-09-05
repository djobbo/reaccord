# Client

Reaccord's client is based on the DiscordJS Client with a few additional features.  
You can use this client just like you'd use DiscordJS' client.

### Usage

```ts
import { Client } from "reaccord"

const client = createClientt({
    token: 'token',
    ...
})
```

### Options

**token** `string` _required_

> Required

Discord bot token.

---

**intents** `Array<Intent>` _required_

> Required

Discord bot intents

---

**devGuildId** `string` _optional_

> Required in dev mode

Id of the discord server you'll test your bot in.

---

**clientId** `string` _optional_

> Required if you use **Slash commands** or **Message/User context menu commands**

### Other options

> See DiscordJS's Client options

# Client Object

## Properties

**connect** `(callback: (client: Client)) => Promise<void>`  
Connect the client using the token provided when instantiated

```ts:no-line-numbers
client.connect(() => console.log('Hello World'))
```

---

**renderMessage**  
`(ref: Channel | Message | CommandInteraction, Code: () => JSX.Element)`  
` => Promise<Message>`  
Sends a message rendered with react  
if `ref` is a Channel, sends message to channel  
if `ref` is a Message, responds to message  
if `ref` is an Interaction, responds to interaction

```tsx:no-line-numbers
client.renderMessage(channelObj, () => <MyCoolMessage />)
```

---

**createSlashCommand**

---

**createUserCtxCommand**

---

**createMessageCtxCommand**

---

**refreshCommands**
