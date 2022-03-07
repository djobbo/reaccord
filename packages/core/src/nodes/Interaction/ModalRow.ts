import { BaseNode } from "../_Base"
import { ActionRow, TextInputComponent } from "discord.js"
import { RootNode } from "../Root"
import { InputNode, isInputNode } from "./Input"

export class ModalRowNode extends BaseNode<"modal-row", RootNode, InputNode> {
    constructor() {
        super("modal-row")
    }

    render(): ActionRow<TextInputComponent> {
        const actionRow = new ActionRow<TextInputComponent>()
        actionRow.setComponents(...this.children.filter(isInputNode).map((child) => child.render()))
        return actionRow
    }
}

export const isModalRowNode = (node: BaseNode): node is ModalRowNode => node instanceof ModalRowNode
