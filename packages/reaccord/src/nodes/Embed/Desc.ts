import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class DescNode extends TextContainerNode<"Desc", EmbedNode> {
  constructor() {
    super("Desc")
  }

  render(embed: EmbedBuilder): void {
    embed.setDescription(this.innerText ?? EMPTY_STRING)
  }
}
