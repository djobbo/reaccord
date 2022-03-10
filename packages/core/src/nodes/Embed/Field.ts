import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../constants"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"

export class FieldNode extends TextContainerNode<"field", EmbedNode> {
    constructor() {
        super("field")
    }

    render(embed: Embed): void {
        embed.addFields({
            name: this.attr.title ?? EMPTY_STRING,
            value: this.innerText,
            inline: this.attr.inline,
        })
    }
}

export const isFieldNode = (node: BaseNode): node is FieldNode =>
    node instanceof FieldNode
