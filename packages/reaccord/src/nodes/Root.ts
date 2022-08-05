import { BaseNode } from "./_Base"
import { EMPTY_STRING } from "../helpers/constants"
import {
	isActionRowNode,
	isContentNode,
	isEmbedNode,
	isFileNode,
	isImageNode,
} from "./guards"
import type {
	Client,
	Interaction,
	Message,
	MessageEditOptions,
	MessageOptions,
} from "discord.js"
import type { FileAttachment } from "../jsx"

export type MessageReactionType =
	| "ADD"
	| "REMOVE"
	| "REMOVE_ALL"
	| "REMOVE_EMOJI"

export type MessageResponseOptions = {
	/**
	 * Interactions will not respond after this amount of time (s).
	 * @default 300 (5min)
	 */
	staleAfter?: number | null
}

export class RootNode extends BaseNode<"Root", BaseNode, BaseNode> {
	client: Client
	onRender: ((node: RootNode) => void) | undefined
	interactionListeners: Record<
		string,
		(interaction: Interaction) => unknown
	> = {}
	files = new Set<FileAttachment>()
	message: Message
	messageResponseOptions: MessageResponseOptions = {
		staleAfter: 5 * 60,
	}

	constructor(
		client: Client,
		message: Message,
		onRender?: (node: RootNode) => void | undefined,
		options: MessageResponseOptions = {},
	) {
		super("Root")
		this.client = client
		this.message = message
		this.onRender = onRender
		this.messageResponseOptions = {
			...this.messageResponseOptions,
			...options,
		}

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

	addFile(file: FileAttachment) {
		this.files.add(file)
	}

	resetFiles() {
		this.files.clear()
	}

	render(): MessageOptions | MessageEditOptions {
		this.resetListeners()
		this.resetFiles()

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
			files: [
				...this.files,
				...this.children
					.filter(isFileNode)
					.map((child) => child.render()),
				...(this.children
					.filter(isImageNode)
					.map((child) => child.render())
					.filter(Boolean) as FileAttachment[]),
			],
		}
	}
}
