import { ActionRow } from "discord.js"
import { BaseNode } from "../_Base"
import { isButtonNode } from "./Button"
import { isSelectNode } from "./Select"
import type { ButtonNode } from "./Button"
import type { MessageActionRowComponent } from "discord.js"
import type { RootNode } from "../Root"
import type { SelectNode } from "./Select"

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
