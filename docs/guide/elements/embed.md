# Embed

## Container

Adding embeds to your messages is very easy, just create a `<embed>` tag and there you go! `<embed>` tags should be a direct children of `<message>`, and should not be nested further.

```tsx
const App = () => (
  <embed>
    <title>Hello</title>
  </embed>
)
```

## Title

Changes the embed title

### Usage

```tsx
<embed>
  <title>My Title</title>
</embed>
```

### Tip

As an embed can only have one title, if mutiple are encountered, the last one will take effect.

```tsx
<embed>
  <title>My Title</title>
  <title>A Better Title</title>
</embed>
```

is equivalent to

```tsx
<embed>
  <title>A Better Title</title>
</embed>
```

and will render to:

TODO: Add image
