import { ActionRow } from "discord.js"
import { BaseNode } from "../_Base"
import { isInputNode } from "../guards"
import type { InputNode } from "./Input"
import type { RootNode } from "../Root"
import type { TextInputComponent } from "discord.js"

export class ModalRowNode extends BaseNode<"modal-row", RootNode, InputNode> {
    constructor() {
        super("modal-row")
    }

    render(): ActionRow<TextInputComponent> {
        const actionRow = new ActionRow<TextInputComponent>()
        actionRow.setComponents(
            ...this.children.filter(isInputNode).map((child) => child.render())
        )
        return actionRow
    }
}
