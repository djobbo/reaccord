import { BaseNode } from "./_Base"
import { EMPTY_STRING } from "../helpers/constants"
import { isActionRowNode, isContentNode, isEmbedNode } from "./guards"
import type {
    Client,
    Interaction,
    Message,
    MessageEditOptions,
    MessageOptions,
} from "discord.js"

export type MessageReactionType =
    | "ADD"
    | "REMOVE"
    | "REMOVE_ALL"
    | "REMOVE_EMOJI"

export class RootNode extends BaseNode<"root", BaseNode, BaseNode> {
    client: Client

    onRender: ((node: RootNode) => void) | undefined

    interactionListeners: Record<
        string,
        (interaction: Interaction) => unknown
    > = {}

    message: Message

    constructor(
        client: Client,
        message: Message,
        onRender?: (node: RootNode) => void | undefined,
    ) {
        super("root")
        this.client = client
        this.message = message
        this.onRender = onRender

        client.on("interactionCreate", (interaction) => {
            // TODO: Add proper disposal
            if (!interaction.isButton() && !interaction.isSelectMenu()) return
            interaction
            const listener = this.interactionListeners[interaction.customId]
            listener?.(interaction)
        })
    }

    onNodeRender() {
        this.onRender?.(this)
    }

    get rootNode() {
        return this
    }

    addInteractionListener(
        uuid: string,
        fn: (interaction: Interaction) => unknown,
    ) {
        this.interactionListeners[uuid] = fn
    }

    resetListeners() {
        this.interactionListeners = {}
    }

    render(): MessageOptions | MessageEditOptions {
        this.resetListeners()

        return {
            content:
                this.children
                    .filter(isContentNode)
                    .map((child) => child.render())
                    .at(-1) || EMPTY_STRING,
            embeds: this.children
                .filter(isEmbedNode)
                .map((child) => child.render()),
            components: this.children
                .filter(isActionRowNode)
                .map((child) => child.render()),
        }
    }
}
