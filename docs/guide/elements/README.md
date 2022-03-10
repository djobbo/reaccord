# Message

This is the only required element for all your messages. It needs to be the outer most node and englobs all content (text content, embeds, interaction components...).

```tsx
const App = () => (
    <message></message>
)
```

### Usage

```tsx
const App = () => (
    <message>
        <content>Hello World</content>
        <embed>
            <title>Yay!</title>
        </embed>
    </message>
)
```

### Props

#### onReply

#### onReactionAdd

#### onReactionRemove

#### onReactionRemoveAll

#### onReactionRemoveEmoji