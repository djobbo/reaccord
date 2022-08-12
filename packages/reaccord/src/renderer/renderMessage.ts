import { RootNode } from "../nodes"
import { render } from "./render"
import type { Client } from "../Client"
import type { InteractionRef, MessageResponseOptions } from "../nodes"
import type { Message } from "discord.js"

export type RenderMessageFn = (
  ref: InteractionRef,
  Code: () => JSX.Element,
) => Promise<Message>

export const renderMessage =
  (client: Client, rootOptions: MessageResponseOptions): RenderMessageFn =>
  async (ref, Code) => {
    const root = new RootNode(client, ref, rootOptions)
    render(Code, root)
    return root.updateMessage()
  }
