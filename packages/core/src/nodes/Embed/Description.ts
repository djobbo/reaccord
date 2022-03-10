import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class DescriptionNode extends TextContainerNode<"desc", EmbedNode> {
    constructor() {
        super("desc")
    }

    render(embed: Embed): void {
        embed.setDescription(this.innerText ?? EMPTY_STRING)
    }
}
