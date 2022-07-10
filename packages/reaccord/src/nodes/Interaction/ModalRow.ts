import { BaseNode } from "../_Base"
import { MessageActionRow } from "discord.js"
import { isInputNode } from "../guards"
import type { InputNode } from "./Input"
import type { ModalActionRowComponent } from "discord.js"
import type { RootNode } from "../Root"

export class ModalRowNode extends BaseNode<"modal-row", RootNode, InputNode> {
    constructor() {
        super("modal-row")
    }

    render(): MessageActionRow<ModalActionRowComponent> {
        const actionRow = new MessageActionRow<ModalActionRowComponent>()
        actionRow.setComponents(
            this.children.filter(isInputNode).map((child) => child.render()),
        )
        return actionRow
    }
}
