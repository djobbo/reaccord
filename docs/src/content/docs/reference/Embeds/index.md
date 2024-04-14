---
title: Embed
description: Embed Component
---

The Embed component allows you to create rich embeds for Discord messages. Here's how you can use it:

```jsx
import { Embed } from "reaccord"

<Embed color="Green">
  <Embed.Title>Title</Embed.Title>
  <Embed.Field title="Field 1">Value 1</Embed.Field>
  <Embed.Field title="Field 2">Value 2</Embed.Field>
  {/* Add more fields or components */}
</Embed>
```

Props:
- color: Color of the embed. Accepts Discord color constants or hex codes.
- children: Content of the embed. Can include `Embed.Title`, `Embed.Field`, `Embed.Thumbnail`, etc.