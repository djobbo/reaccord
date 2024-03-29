# Features

## Client

- `createClient`

## Commands

- `createSlashCommand`
- `createMessageCtxCommand`
- `createUserCtxCommand`
- `refreshCommands`

## Message Components

- Content (`<content>`)
  - `<a>`
  - `<code>`
  - `<codeblock>`
  - `<br>`
  - `<span>`
- Embed (`<embed>`)
  - `<author>`
  - `<color>`
  - `<desc>`
  - `<field>`
  - `<footer>`
  - `<img>`
  - `<thumbnail>`
- ActionRow (`<action-row>`)
  - `<button>`
  - `<select>`
    - `<option>`
- Modal (`<modal>`)
  - `<modal-row>`
  - `<input>`

## Hooks

- useMessageCtx
- useModal
- useOnReactionAdd
- useOnReactionRemove
- useOnReactionRemoveAll
- useOnReactionRemoveEmoji
- useOnReply

## Router

TODO: add some kind of warning when interaction is stale
.onStaleInteraction((interaction) => interaction.reply('Interaction is stale'))

TODO: when message is deleted
remove all interaction listeners

performReactRefresh
scheduleRefresh
console.log('[React Refresh] Rendering new root:', root.containerInfo.message?.id, root.containerInfo.client.user?.username);

react-refresh-runtime.development.js
-> mountedRoots to check if we clean old roots correctly
