import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class UrlNode extends TextContainerNode<"Url", EmbedNode> {
  constructor() {
    super("Url")
  }

  render(embed: EmbedBuilder): void {
    if (!this.attr.href) return
    embed.setURL(this.attr.href)
  }
}
