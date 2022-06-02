import { TextContainerNode } from "./_TextContainer"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed/Embed"

export class TitleNode extends TextContainerNode<"title", EmbedNode> {
    constructor() {
        super("title")
    }

    render(embed: Embed): void {
        embed.setTitle(this.innerText)
    }
}
