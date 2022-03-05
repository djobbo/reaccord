import { BaseNode } from "./_Base"
import { TextInputComponent, TextInputStyle } from "discord.js"
import { ActionRowNode } from "./ActionRow"
import { TextNode } from "./Text"

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
            .setLabel(this.attr.label ?? "")
            .setValue(this.attr.value ?? "")
            .setPlaceholder(this.attr.placeholder ?? "")
            .setRequired(this.attr.required ?? false)
            .setStyle(this.attr.large ? TextInputStyle.Paragraph : TextInputStyle.Short)

        return input
    }
}

export const isInputNode = (node: BaseNode): node is InputNode => node instanceof InputNode
