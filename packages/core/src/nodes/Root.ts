import { BaseNode } from "./_Base"
import { MessageType } from "discord.js"
import { isMessageNode } from "./guards"
import type {
    Client,
    Collection,
    Interaction,
    Message,
    MessageEditOptions,
    MessageOptions,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js"
import type { MessageNode } from "./Message"

export type MessageReactionType =
    | "ADD"
    | "REMOVE"
    | "REMOVE_ALL"
    | "REMOVE_EMOJI"
export type ReactionAddListener = (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => void
export type ReactionRemoveListener = (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => void
export type ReactionRemoveAllListener = (
    reactions: Collection<string, MessageReaction>
) => void
export type ReactionRemoveEmojiListener = (
    reaction: MessageReaction | PartialMessageReaction
) => void
export type MessageReplyListener = (message: Message) => void

export class RootNode extends BaseNode<"root", BaseNode, MessageNode> {
    client: Client

    onRender: ((node: RootNode) => void) | undefined

    interactionListeners: Record<
        string,
        (interaction: Interaction) => unknown
    > = {}

    message: Message | undefined

    reactionListeners: {
        ADD: ReactionAddListener[]
        REMOVE: ReactionRemoveListener[]
        REMOVE_ALL: ReactionRemoveAllListener[]
        REMOVE_EMOJI: ReactionRemoveEmojiListener[]
    } = {
        ADD: [],
        REMOVE: [],
        REMOVE_ALL: [],
        REMOVE_EMOJI: [],
    }

    replyListeners: MessageReplyListener[] = []

    constructor(
        client: Client,
        onRender?: (node: RootNode) => void | undefined
    ) {
        super("root")
        this.client = client
        this.onRender = onRender

        client.on("interactionCreate", (interaction) => {
            // TODO: Add proper disposal
            if (!interaction.isButton() && !interaction.isSelectMenu()) return
            interaction
            const listener = this.interactionListeners[interaction.customId]
            listener?.(interaction)
        })

        client.on("messageReactionAdd", (reaction, user) => {
            if (!this.message || reaction.message.id !== this.message.id) return
            this.reactionListeners.ADD.forEach((listener) =>
                listener(reaction, user)
            )
        })
        client.on("messageReactionRemove", (reaction, user) => {
            if (!this.message || reaction.message.id !== this.message.id) return
            this.reactionListeners.REMOVE.forEach((listener) =>
                listener(reaction, user)
            )
        })
        client.on("messageReactionRemoveAll", (message, reactions) => {
            if (!this.message || message.id !== this.message.id) return
            this.reactionListeners.REMOVE_ALL.forEach((listener) =>
                listener(reactions)
            )
        })
        client.on("messageReactionRemoveEmoji", (reaction) => {
            if (!this.message || reaction.message.id !== this.message.id) return
            this.reactionListeners.REMOVE_EMOJI.forEach((listener) =>
                listener(reaction)
            )
        })

        client.on("messageCreate", (message) => {
            if (
                !this.message ||
                message.type !== MessageType.Reply ||
                !message.reference?.messageId ||
                message.reference.messageId !== this.message.id
            )
                return
            this.replyListeners.forEach((listener) => listener(message))
        })
    }

    onNodeRender() {
        this.onRender?.(this)
    }

    get rootNode() {
        return this
    }

    setMessage(message: Message) {
        this.message = message
    }

    addInteractionListener(
        uuid: string,
        fn: (interaction: Interaction) => unknown
    ) {
        this.interactionListeners[uuid] = fn
    }

    addReactionListener(type: "ADD", listener: ReactionAddListener): void

    addReactionListener(type: "REMOVE", listener: ReactionRemoveListener): void

    addReactionListener(
        type: "REMOVE_ALL",
        listener: ReactionRemoveAllListener
    ): void

    addReactionListener(
        type: "REMOVE_EMOJI",
        listener: ReactionRemoveEmojiListener
    ): void

    addReactionListener(
        type: MessageReactionType,
        listener:
            | ReactionAddListener
            | ReactionRemoveListener
            | ReactionRemoveAllListener
            | ReactionRemoveEmojiListener
    ): void {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/22609
        this.reactionListeners[type].push(listener)
    }

    addReplyListener(listener: MessageReplyListener) {
        this.replyListeners.push(listener)
    }

    resetListeners() {
        this.reactionListeners.ADD = []
        this.reactionListeners.REMOVE = []
        this.reactionListeners.REMOVE_ALL = []
        this.reactionListeners.REMOVE_EMOJI = []
        this.interactionListeners = {}
        this.replyListeners = []
    }

    render(): MessageOptions | MessageEditOptions {
        this.resetListeners()
        const messageNode = this.firstChild
        if (
            this.children.length !== 1 ||
            !messageNode ||
            !isMessageNode(messageNode)
        )
            throw new Error("root should only have one child, a <message> node")
        return messageNode.render()
    }
}
