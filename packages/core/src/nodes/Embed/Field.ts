import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

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
