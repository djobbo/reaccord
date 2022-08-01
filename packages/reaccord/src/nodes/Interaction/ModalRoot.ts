import { BaseNode } from "../_Base"
import { InteractionType } from "discord.js"
import { isModalNode } from "../guards"
import type { Client, Interaction, ModalBuilder } from "discord.js"
import type { ModalNode } from "./Modal"

export class ModalRootNode extends BaseNode<"modal-root", BaseNode, ModalNode> {
	client: Client

	interactionListeners: Record<
		string,
		(interaction: Interaction) => unknown
	> = {}

	constructor(client: Client) {
		super("modal-root")
		this.client = client

		client.on("interactionCreate", (interaction) => {
			if (interaction.type !== InteractionType.ModalSubmit) return
			const listener = this.interactionListeners[interaction.customId]
			listener?.(interaction)
		})
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

	render(): ModalBuilder {
		const modalNode = this.firstChild
		if (this.children.length !== 1 || !modalNode || !isModalNode(modalNode))
			throw new Error("modal should only have one child, a <modal> node")
		return modalNode.render()
	}
}
