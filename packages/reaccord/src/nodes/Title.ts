import { TextContainerNode } from "./_TextContainer"
import type { EmbedNode } from "./Embed/Embed"
import type { MessageEmbed } from "discord.js"

export class TitleNode extends TextContainerNode<"title", EmbedNode> {
    constructor() {
        super("title")
    }

    render(embed: MessageEmbed): void {
        embed.setTitle(this.innerText)
    }
}
