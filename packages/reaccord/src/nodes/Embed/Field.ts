import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class FieldNode extends TextContainerNode<"field", EmbedNode> {
    constructor() {
        super("field")
    }

    render(embed: MessageEmbed): void {
        embed.addFields([
            {
                name: this.attr.title ?? EMPTY_STRING,
                value: this.innerText,
                inline: this.attr.inline,
            },
        ])
    }
}
