import { useEffect } from "react"
import { useMessageCtx } from "./MessageContext"
import type { DependencyList } from "react"
import type { EventListener } from "./MessageContext"

type EventHandlerOptions = Partial<{
    allowBot: boolean
    allowMe: boolean
}>

export const useOnReactionAdd = (
    handler: EventListener<"messageReactionAdd">,
    deps: DependencyList | undefined = undefined,
    { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
    const { onReactionAdd } = useMessageCtx()

    useEffect(
        () =>
            onReactionAdd(handler, (reaction, user) => {
                if (!allowBot && user.bot) return false
                if (!allowMe && reaction.me) return false
                return true
            }),
        deps,
    )
}

export const useOnReactionRemove = (
    handler: EventListener<"messageReactionRemove">,
    deps: DependencyList | undefined = undefined,
    { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
    const { onReactionRemove } = useMessageCtx()

    useEffect(
        () =>
            onReactionRemove(handler, (reaction, user) => {
                if (!allowBot && user.bot) return false
                if (!allowMe && reaction.me) return false
                return true
            }),
        deps,
    )
}

export const useOnReactionRemoveAll = (
    handler: EventListener<"messageReactionRemoveAll">,
    deps: DependencyList | undefined = undefined,
) => {
    const { onReactionRemoveAll } = useMessageCtx()

    useEffect(() => onReactionRemoveAll(handler, () => true), deps)
}

export const useOnReactionRemoveEmoji = (
    handler: EventListener<"messageReactionRemoveEmoji">,
    deps: DependencyList | undefined = undefined,
) => {
    const { onReactionRemoveEmoji } = useMessageCtx()

    useEffect(() => onReactionRemoveEmoji(handler, () => true), deps)
}

export const useOnReply = (
    handler: EventListener<"messageCreate">,
    deps: DependencyList | undefined = undefined,
    { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
    const { onReply, client } = useMessageCtx()

    useEffect(
        () =>
            onReply(handler, (message) => {
                if (!allowBot && message.author.bot) return false
                if (!allowMe && message.author.id === client.user?.id)
                    return false
                return true
            }),
        deps,
    )
}
