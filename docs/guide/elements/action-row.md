# Action Row

## Container

`<action-row>` is a top-level element and should only be used as a direct child of your `<message>` element.

> You can have a maximum of 5 action rows per message, as per Discord API's specs.

```tsx
const App = () => (
    <action-row>
        <button>Click Me!</button>
    </action-row>
)
```

## Button

Creates an interaction button.

> You can have a maximum of 5 buttons per interaction rows, as per Discord API's specs.

### Usage

```tsx
<action-row>
    <button>My Button</button>
</action-row>
```

### Props

#### onClick `(interaction: ButtonInteraction) => any`

> Read more about [ButtonInteraction](https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction) on the (discord.js docs)

```tsx
<button onClick={({ user }) => console.log(`Hi ${user.username}!`)}>
    Say Hello
</button>
```

And when I click

```:no-line-numbers
Hi Alfie!
```

### Important

By default `onClick` will respond to the interaction with a `deferUpdate`, in order to prevent discord from telling the user that their interaction failed.

To prevent this default behaviour, return a truthy value in your function.

#### Example

Will trigger default behaviour

```tsx
<button
    onClick={() => {
        console.log("hello")
    }}
>
    My Button
</button>
```

Won't trigger default behaviour, the interaction will fail if you don't handle it yourself.

```tsx
<button
    onClick={() => {
        console.log("hello")
        return true // or 1 or a non empty string etc...
    }}
>
    My Button
</button>
```
