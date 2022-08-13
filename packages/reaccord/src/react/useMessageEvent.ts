import { useEffect } from "react"
import { useMessageCtx } from "./MessageContext"
import type { DependencyList } from "react"
import type { EventHandler } from "../Client"

type EventHandlerOptions = Partial<{
  allowBot: boolean
  allowMe: boolean
}>

export const useReactionAdded = (
  handler: EventHandler<"messageReactionAdd">,
  deps: DependencyList | undefined = undefined,
  { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
  const { client, message } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo("messageReactionAdd", (reaction, user) => {
        if (!message) return
        if (reaction.message.id !== message.id) return
        if (!allowBot && user.bot) return
        if (!allowMe && reaction.me) return

        handler(reaction, user)
      }),
    deps,
  )
}

export const useReactionRemoved = (
  handler: EventHandler<"messageReactionRemove">,
  deps: DependencyList | undefined = undefined,
  { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
  const { client, message } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo("messageReactionRemove", (reaction, user) => {
        if (!message) return
        if (reaction.message.id !== message.id) return
        if (!allowBot && user.bot) return
        if (!allowMe && reaction.me) return

        handler(reaction, user)
      }),
    deps,
  )
}

export const useAllReactionRemoved = (
  handler: EventHandler<"messageReactionRemoveAll">,
  deps: DependencyList | undefined = undefined,
) => {
  const { client, message } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo(
        "messageReactionRemoveAll",
        async (reactionMessage, reactions) => {
          if (!message) return
          if (reactionMessage.id !== message.id) return
          await handler(reactionMessage, reactions)
        },
      ),
    deps,
  )
}

export const useReactionEmojiRemoved = (
  handler: EventHandler<"messageReactionRemoveEmoji">,
  deps: DependencyList | undefined = undefined,
) => {
  const { client, message } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo("messageReactionRemoveEmoji", async (reaction) => {
        if (!message) return
        if (reaction.message.id !== message.id) return
        await handler(reaction)
      }),
    deps,
  )
}

export const useReceivedReply = (
  handler: EventHandler<"messageCreate">,
  deps: DependencyList | undefined = undefined,
  { allowBot = true, allowMe = true }: EventHandlerOptions = {},
) => {
  const { client, message } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo("messageCreate", async (createdMessage) => {
        if (!message) return
        if (
          !createdMessage.reference?.messageId ||
          createdMessage.reference.messageId !== message.id
        )
          return
        if (!allowBot && message.author.bot) return
        if (!allowMe && message.author.id === client.user?.id) return

        await handler(createdMessage)
      }),
    deps,
  )
}

export const useMessageDeleted = (
  handler: EventHandler<"messageDelete">,
  deps: DependencyList | undefined = undefined,
) => {
  const { client, message, terminateInteraction } = useMessageCtx()

  useEffect(
    () =>
      client.listenTo("messageDelete", async (deletedMessage) => {
        if (!message) return
        if (deletedMessage.id !== message.id) return

        await Promise.all([terminateInteraction(), handler(deletedMessage)])
      }),
    deps,
  )
}
