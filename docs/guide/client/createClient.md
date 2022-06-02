# createClient

Creates a new [Reaccord Client](#client-object)

### Usage
```ts
import { createClient } from "reaccord"

const client = createClient({
    token: 'token',
    ...
})
```

### Options

**token** `string` *required*
> Required

Discord bot token.

**intents** `Array<Intent>` *required*
> Required

Discord bot intents

**devGuildId** `string` *required*
> Required in dev mode

Id of the discord server you'll test your bot in.

**clientId** `string`  *required*
> Required if you use **Slash commands** or **Message/User context menu commands**

### Other options *optional*

# Client Object

## Properties

**client** `DiscordJSClient`

**connect** `async (callback: (client: DiscordJSClient)) => void`

**renderMessage**

**refreshCommands**

**createCommand**

**createUserCtxCommand**

**createMessageCtxCommand**