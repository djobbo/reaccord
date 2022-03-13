import { useEffect } from "react"
import { useMessageCtx } from "./MessageContext"
import type { DependencyList } from "react"
import type { Listener } from "./MessageContext"

type EventHandlerOptions = Partial<{
    allowBot: boolean
    allowMe: boolean
}>

export const useReactionAddEffect = (
    handler: Listener<"messageReactionAdd">,
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

export const useReactionRemoveEffect = (
    handler: Listener<"messageReactionRemove">,
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

export const useReactionRemoveAllEffect = (
    handler: Listener<"messageReactionRemoveAll">,
    deps: DependencyList | undefined = undefined,
) => {
    const { onReactionRemoveAll } = useMessageCtx()
    useEffect(() => onReactionRemoveAll(handler), deps)
}

export const useReactionRemoveEmojiEffect = (
    handler: Listener<"messageReactionRemoveEmoji">,
    deps: DependencyList | undefined = undefined,
) => {
    const { onReactionRemoveEmoji } = useMessageCtx()
    useEffect(() => onReactionRemoveEmoji(handler), deps)
}

export const useReplyEffect = (
    handler: Listener<"messageCreate">,
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
