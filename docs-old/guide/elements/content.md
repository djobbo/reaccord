# Text Content

The message content is basically the text content of your message.

## Container

To add text content to your message, wrap some text inside a `<content>` element. The `<content>` tag should be a direct child of `<message>`, and should not be nested further.

```tsx
const App = () => <content>Hello</content>
```

## Span

You can add bold or italic text using the span element.

### Usage

Span can be used anywhere markdown is allowed:

- Text content
- Embed Field content

```tsx
<content>
  <span>Text</span>
</content>
```

### Props

#### bold `boolean`

Will render **bold** text.

```tsx
<span bold>Bold Text</span>
```

#### italic `boolean`

Will render text in _italics_.

```tsx
<span italic>Italic Text</span>
```

### Tip

`bold` and `italic` are compatible, and can be used at the same time to render **_Bold & Italic text_**

```tsx
<span bold italic>
  Bold & Italic Text
</span>
```
