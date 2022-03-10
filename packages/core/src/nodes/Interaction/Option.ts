import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import { SelectMenuOption } from "discord.js"
import type { SelectNode } from "./Select"

export class OptionNode extends BaseNode<"option", SelectNode> {
    constructor() {
        super("option")
    }

    render(): SelectMenuOption {
        const option = new SelectMenuOption()
            .setDefault(this.attr.default ?? false)
            .setLabel(this.attr.label ?? EMPTY_STRING)
            .setValue(this.attr.value ?? "")
        if (this.attr.description) option.setDescription(this.attr.description)

        return option
    }
}

export const isOptionNode = (node: BaseNode): node is OptionNode =>
    node instanceof OptionNode
