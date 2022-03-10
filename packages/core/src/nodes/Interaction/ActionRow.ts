import { ActionRow, MessageActionRowComponent } from "discord.js"
import { BaseNode } from "../_Base"
import { ButtonNode, isButtonNode } from "./Button"
import { RootNode } from "../Root"
import { SelectNode, isSelectNode } from "./Select"

export class ActionRowNode extends BaseNode<
    "action-row",
    RootNode,
    ButtonNode | SelectNode
> {
    constructor() {
        super("action-row")
    }

    render(): ActionRow<MessageActionRowComponent> {
        const actionRow = new ActionRow()
        actionRow.setComponents(
            ...this.children
                .filter((child) => isButtonNode(child) || isSelectNode(child))
                .map((child) => child.render())
        )
        return actionRow
    }
}

export const isActionRowNode = (node: BaseNode): node is ActionRowNode =>
    node instanceof ActionRowNode
