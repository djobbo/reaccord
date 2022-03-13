# useReplyEffect

Callback function is called when a user replies to the current message.

## Usage

```tsx
const App = () => {
    useReplyEffect((message) => {
        message.react('❤️')
    }, [])

    return <></>
}
```

## Options

You can provide an optional `option` object

```tsx{1-3,8}
const options = {
    allowBot: false
}

const App = () => {
    useReplyEffect((message) => {
        message.react('❤️')
    }, [], options)

    return <></>
}
```

### allowBot

> Defaults to `true`

Interaction won't trigger if option is set to `false` and a bot replied.

### allowMe

> Defaults to `true`

Interaction won't trigger if option is set to `false` and the current bot itself replied.