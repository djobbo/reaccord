import { ActionRowBuilder } from "discord.js"
import { BaseNode } from "../_Base"
import { isButtonNode, isSelectNode } from "../guards"
import type { ButtonNode } from "./Button"
import type { MessageActionRowComponentBuilder } from "discord.js"
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

    render(): ActionRowBuilder<MessageActionRowComponentBuilder> {
        const actionRow =
            new ActionRowBuilder<MessageActionRowComponentBuilder>()
        actionRow.setComponents(
            this.children
                .filter((child) => isButtonNode(child) || isSelectNode(child))
                .map((child) => child.render()),
        )
        return actionRow
    }
}
