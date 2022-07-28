import {
    CommandInteraction,
    ContextMenuCommandInteraction,
    Message,
} from "discord.js"
import { EMPTY_STRING } from "../helpers/constants"
import { RootNode } from "../nodes"
import { render } from "./render"
import type { Client } from "../Client"
import type {
    DMChannel,
    MessageEditOptions,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js"
import type { JSX } from "../../jsx-runtime"
import type { MessageResponseOptions } from "../nodes"

type Channel =
    | DMChannel
    | PartialDMChannel
    | NewsChannel
    | TextChannel
    | ThreadChannel

const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms = 300) => {
    let timeoutId: NodeJS.Timeout
    return (...args: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), ms)
    }
}

export type RenderMessageFn = (
    ref: Channel | Message | CommandInteraction | ContextMenuCommandInteraction,
    Code: () => JSX.Element,
) => Promise<Message>

export const renderMessage =
    (client: Client, rootOptions: MessageResponseOptions): RenderMessageFn =>
    async (ref, Code) => {
        let message =
            ref instanceof Message
                ? await ref.reply(EMPTY_STRING)
                : ref instanceof CommandInteraction ||
                  ref instanceof ContextMenuCommandInteraction
                ? await ref.reply({
                      content: EMPTY_STRING,
                      fetchReply: true,
                  })
                : await ref.send(EMPTY_STRING)

        const cb = async (root: RootNode) => {
            const rendered = root.render()
            if (message)
                return await message.edit(rendered as MessageEditOptions)
            throw new Error("Failed to send message")
        }

        const root = new RootNode(
            client,
            message,
            debounce(cb, 50),
            rootOptions,
        )
        render(Code, root, client, message)
        return message
    }
