import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import type { MessageSelectOptionData } from "discord.js"
import type { SelectNode } from "./Select"

export class OptionNode extends BaseNode<"option", SelectNode> {
    constructor() {
        super("option")
    }

    render(): MessageSelectOptionData {
        // TODO: Check for a builder in a later update
        // const option = new SelectMenuOptionBuilder()
        //     .setDefault(this.attr.default ?? false)
        //     .setLabel(this.attr.label ?? EMPTY_STRING)
        //     .setValue(this.attr.value ?? "")
        // if (this.attr.description) option.setDescription(this.attr.description)

        let option: MessageSelectOptionData = {
            default: this.attr.default ?? false,
            label: this.attr.label ?? EMPTY_STRING,
            value: this.attr.value ?? "",
            description: this.attr.description,
        }

        return option
    }
}
