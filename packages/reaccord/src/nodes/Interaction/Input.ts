import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import { TextInputComponent } from "discord.js"
import { TextInputStyles } from "discord.js/typings/enums"
import type { ActionRowNode } from "./ActionRow"
import type { TextNode } from "../Text"

export class InputNode extends BaseNode<"input", ActionRowNode, TextNode> {
    constructor() {
        super("input")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    render(): TextInputComponent {
        const { customId } = this
        const input = new TextInputComponent()
            .setCustomId(customId)
            .setLabel(this.attr.label || EMPTY_STRING)
            .setValue(this.attr.value ?? EMPTY_STRING)
            .setPlaceholder(this.attr.placeholder ?? EMPTY_STRING)
            .setRequired(this.attr.required ?? false)
            .setStyle(
                this.attr.large
                    ? TextInputStyles.PARAGRAPH
                    : TextInputStyles.SHORT,
            )

        return input
    }
}
