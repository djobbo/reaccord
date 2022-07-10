import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class DescriptionNode extends TextContainerNode<"desc", EmbedNode> {
    constructor() {
        super("desc")
    }

    render(embed: MessageEmbed): void {
        embed.setDescription(this.innerText ?? EMPTY_STRING)
    }
}
