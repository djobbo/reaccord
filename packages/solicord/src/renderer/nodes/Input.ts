import { BaseNode } from "./_Base"
import { TextInputComponent, TextInputStyle } from "discord.js"
import { ActionRowNode } from "./ActionRow"
import { TextNode } from "./Text"
import { EMPTY_STRING } from '../../constants'

export class InputNode extends BaseNode<"input", ActionRowNode, TextNode> {
    constructor() {
        super("input")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    render(): TextInputComponent {
        const customId = this.customId
        const input = new TextInputComponent()
            .setCustomId(customId)
            .setLabel(this.attr.label || EMPTY_STRING)
            .setValue(this.attr.value ?? EMPTY_STRING)
            .setPlaceholder(this.attr.placeholder ?? EMPTY_STRING)
            .setRequired(this.attr.required ?? false)
            .setStyle(this.attr.large ? TextInputStyle.Paragraph : TextInputStyle.Short)

        return input
    }
}

export const isInputNode = (node: BaseNode): node is InputNode => node instanceof InputNode
