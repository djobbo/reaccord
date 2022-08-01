import { ActionRowBuilder } from "discord.js"
import { BaseNode } from "../_Base"
import { isInputNode } from "../guards"
import type { InputNode } from "./Input"
import type { ModalActionRowComponentBuilder } from "discord.js"
import type { RootNode } from "../Root"

export class ModalRowNode extends BaseNode<"modal-row", RootNode, InputNode> {
	constructor() {
		super("modal-row")
	}

	render(): ActionRowBuilder<ModalActionRowComponentBuilder> {
		const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
		actionRow.setComponents(
			this.children.filter(isInputNode).map((child) => child.render()),
		)
		return actionRow
	}
}
