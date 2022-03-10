import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../constants"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"

export class DescriptionNode extends TextContainerNode<"desc", EmbedNode> {
    constructor() {
        super("desc")
    }

    render(embed: Embed): void {
        embed.setDescription(this.innerText ?? EMPTY_STRING)
    }
}

export const isDescriptionNode = (node: BaseNode): node is DescriptionNode =>
    node instanceof DescriptionNode
