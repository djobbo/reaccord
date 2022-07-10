import { BaseNode } from "../_Base"
import { MessageActionRow } from "discord.js"
import { isButtonNode, isSelectNode } from "../guards"
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

    render(): MessageActionRow<MessageActionRowComponent> {
        const actionRow = new MessageActionRow<MessageActionRowComponent>()
        actionRow.setComponents(
            this.children
                .filter((child) => isButtonNode(child) || isSelectNode(child))
                .map((child) => child.render()),
        )
        return actionRow
    }
}
