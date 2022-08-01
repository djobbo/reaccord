import { createContext, useContext } from "react"
import type { Client } from "../Client"
import type { ClientEvents, Message } from "discord.js"
import type { JSX } from "../../jsx-runtime"

export type EventListener<Event extends keyof ClientEvents> = (
	...args: ClientEvents[Event]
) => void

export type EventHandler<Event extends keyof ClientEvents> = (
	handler: EventListener<Event>,
	isAllowed: (...args: ClientEvents[Event]) => boolean,
) => () => void

export type MessageContext = {
	client: Client
	message: Message
	onReactionAdd: EventHandler<"messageReactionAdd">
	onReactionRemove: EventHandler<"messageReactionRemove">
	onReactionRemoveAll: EventHandler<"messageReactionRemoveAll">
	onReactionRemoveEmoji: EventHandler<"messageReactionRemoveEmoji">
	onReply: EventHandler<"messageCreate">
	terminateInteraction: () => void
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
	onInteractionTerminated: () => void
}

export const MessageProvider = ({
	children,
	client,
	message,
	onInteractionTerminated,
}: MessageProviderProps) => {
	return (
		<messageContext.Provider
			value={{
				client,
				message,
				onReactionAdd: (callback, isAllowed) =>
					client.onReactionAdd(
						callback,
						(reaction, ...args) =>
							reaction.message.id === message.id &&
							isAllowed(reaction, ...args),
					),
				onReactionRemove: (callback, isAllowed) =>
					client.onReactionRemove(
						callback,
						(reaction, ...args) =>
							reaction.message.id === message.id &&
							isAllowed(reaction, ...args),
					),
				onReactionRemoveAll: (callback, isAllowed) =>
					client.onReactionRemoveAll(
						callback,
						(reactionMessage, ...args) =>
							reactionMessage.id === message.id &&
							isAllowed(reactionMessage, ...args),
					),
				onReactionRemoveEmoji: (callback, isAllowed) =>
					client.onReactionRemoveEmoji(
						callback,
						(reaction, ...args) =>
							reaction.message.id === message.id &&
							isAllowed(reaction, ...args),
					),
				onReply: (callback, isAllowed) =>
					client.onReply(
						callback,
						(createdMessage, ...args) =>
							!!createdMessage.reference &&
							!!createdMessage.reference.messageId &&
							createdMessage.reference.messageId === message.id &&
							isAllowed(createdMessage, ...args),
					),
				terminateInteraction: onInteractionTerminated,
			}}
		>
			{children}
		</messageContext.Provider>
	)
}
