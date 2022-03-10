# Text Content

The message content is basically the text content of your message.

## Container

To add text content to your message, wrap some text inside a `<content>` element.

```tsx
const App = () => (
    <message>
        <content>Hello</content>
    </message>
)
```

## Span

You can add bold or italic text using the span element.

```tsx
const App = () => (
    <message>
        <content>
            <span>Normal Text</span>
            <span bold>Bold Text</span>
            <span italic>Italic Text</span>
            <span bold italic>Bold & Italic Text</span>
        </content>
    </message>
)
```