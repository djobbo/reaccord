import { BaseNode } from "../_Base"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class TimestampNode extends BaseNode<"Timestamp", EmbedNode> {
  constructor() {
    super("Timestamp")
  }

  render(embed: EmbedBuilder): void {
    embed.setTimestamp(this.attr.timestamp)
  }
}
