import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import { SelectMenuOptionBuilder } from "discord.js"
import type { SelectNode } from "./Select"

export class OptionNode extends BaseNode<"Option", SelectNode> {
  constructor() {
    super("Option")
  }

  render(): SelectMenuOptionBuilder {
    const option = new SelectMenuOptionBuilder()
      .setDefault(this.attr.default ?? false)
      .setLabel(this.attr.label ?? EMPTY_STRING)
      .setValue(this.attr.value ?? "")
    if (this.attr.description) option.setDescription(this.attr.description)

    return option
  }
}
