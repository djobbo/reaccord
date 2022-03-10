import { createContext, useContext } from "react"
import type { Client, Message } from "discord.js"
import type { JSX } from "../../jsx-runtime"

export type MessageContext = {
    client: Client
    message: Message
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

export const MessageProvider = ({
    children,
    client,
    message,
}: MessageProviderProps) => {
    return (
        <messageContext.Provider value={{ client, message }}>
            {children}
        </messageContext.Provider>
    )
}
