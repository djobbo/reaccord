import { createContext, useContext, useEffect, useState } from "react"
import type { Client, ClientEvents, Message } from "discord.js"
import type { JSX } from "../../jsx-runtime"

export type Listener<Event extends keyof ClientEvents> = (
    ...args: ClientEvents[Event]
) => void

type EventHandler<Event extends keyof ClientEvents> = (
    handler: Listener<Event>,
    isAllowed?: (...args: ClientEvents[Event]) => boolean,
) => () => void

export type MessageContext = {
    client: Client
    message: Message
    onReactionAdd: EventHandler<"messageReactionAdd">
    onReactionRemove: EventHandler<"messageReactionRemove">
    onReactionRemoveAll: EventHandler<"messageReactionRemoveAll">
    onReactionRemoveEmoji: EventHandler<"messageReactionRemoveEmoji">
    onReply: EventHandler<"messageCreate">
}

const messageContext = createContext<MessageContext>({
    // @ts-expect-error
    message: null,
    // @ts-expect-error
    client: null,
})

export const useMessageCtx = () => useContext(messageContext)

export type MessageProviderProps = {
    client: Client
    message: Message
    children?: JSX.Element
}

const useListeners = <
    Event extends keyof ClientEvents,
    Handler extends Listener<Event>,
>(
    client: Client,
    event: Event,
    isActive: (...args: ClientEvents[Event]) => boolean = () => true,
) => {
    const [handlers, setHandlers] = useState<Handler[]>([])

    useEffect(() => {
        const handler = ((...args) => {
            if (!isActive(...args)) return
            handlers.forEach((l) => l(...args))
        }) as Handler

        client.on(event, handler)

        return () => {
            client.removeListener(event, handler as any)
        }
    }, [handlers])

    const addListener: EventHandler<Event> = (listener, isAllowed) => {
        const handler: Listener<Event> = !!isAllowed
            ? (...args) => {
                  if (!isAllowed(...args)) return
                  listener(...args)
              }
            : listener
        setHandlers((prev) => {
            //@ts-expect-error
            prev.push(handler)
            return prev
        })

        return () => {
            setHandlers((prev) => prev.filter((l) => l !== handler))
        }
    }

    return [addListener]
}

export const MessageProvider = ({
    children,
    client,
    message,
}: MessageProviderProps) => {
    const [onReactionAdd] = useListeners(
        client,
        "messageReactionAdd",
        (reaction) => reaction.message.id === message.id,
    )
    const [onReactionRemove] = useListeners(
        client,
        "messageReactionRemove",
        (reaction) => reaction.message.id === message.id,
    )
    const [onReactionRemoveAll] = useListeners(
        client,
        "messageReactionRemoveAll",
        (reactionMessage) => reactionMessage.id === message.id,
    )
    const [onReactionRemoveEmoji] = useListeners(
        client,
        "messageReactionRemoveEmoji",
        (reaction) => reaction.message.id === message.id,
    )
    const [onReply] = useListeners(
        client,
        "messageCreate",
        (createdMessage) =>
            !!createdMessage.reference &&
            !!createdMessage.reference.messageId &&
            createdMessage.reference.messageId === message.id,
    )

    return (
        <messageContext.Provider
            value={{
                client,
                message,
                onReactionAdd,
                onReactionRemove,
                onReactionRemoveAll,
                onReactionRemoveEmoji,
                onReply,
            }}
        >
            {children}
        </messageContext.Provider>
    )
}
