import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import { TextInputBuilder, TextInputStyle } from "discord.js"
import type { ActionRowNode } from "./ActionRow"
import type { TextNode } from "../Text"

export class InputNode extends BaseNode<"Input", ActionRowNode, TextNode> {
  constructor() {
    super("Input")
  }

  get customId() {
    return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
  }

  render(): TextInputBuilder {
    const { customId } = this
    const input = new TextInputBuilder()
      .setCustomId(customId)
      .setLabel(this.attr.label || EMPTY_STRING)
      .setValue(this.attr.value ?? EMPTY_STRING)
      .setPlaceholder(this.attr.placeholder ?? EMPTY_STRING)
      .setRequired(this.attr.required ?? false)
      .setStyle(
        this.attr.large ? TextInputStyle.Paragraph : TextInputStyle.Short,
      )

    return input
  }
}
