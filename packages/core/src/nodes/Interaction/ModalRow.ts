import { ActionRow, TextInputComponent } from "discord.js"
import { BaseNode } from "../_Base"
import { InputNode, isInputNode } from "./Input"
import { RootNode } from "../Root"

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

export const isModalRowNode = (node: BaseNode): node is ModalRowNode =>
    node instanceof ModalRowNode
