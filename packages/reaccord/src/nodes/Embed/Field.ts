import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed"

export class FieldNode extends TextContainerNode<"field", EmbedNode> {
    constructor() {
        super("field")
    }

    render(embed: EmbedBuilder): void {
        embed.addFields([
            {
                name: this.attr.title ?? EMPTY_STRING,
                value: this.innerText,
                inline: this.attr.inline,
            },
        ])
    }
}
