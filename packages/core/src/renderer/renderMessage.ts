import { EMPTY_STRING } from "../helpers/constants"
import { RootNode } from "../nodes"
import type {
    Client,
    DMChannel,
    MessageEditOptions,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js"
import type { JSX } from "../../jsx-runtime"
import type { RenderFn } from "./render"

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

export const renderMessage =
    (render: RenderFn, client: Client) =>
    async (channel: Channel, Code: () => JSX.Element) => {
        const message = await channel.send(EMPTY_STRING)

        const cb = async (root: RootNode) => {
            const rendered = root.render()
            if (message)
                return await message.edit(rendered as MessageEditOptions)
            throw new Error("Failed to send message")
        }

        const root = new RootNode(client, message, debounce(cb, 50))
        render(Code, root, client, message)
        return message
    }
