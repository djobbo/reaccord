import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class AuthorNode extends TextContainerNode<"author", EmbedNode> {
    constructor() {
        super("author")
    }

    render(embed: MessageEmbed): void {
        if (!this.innerText) {
            embed.author = null
            return
        }

        embed.setAuthor({
            name: this.innerText ?? EMPTY_STRING,
            iconURL: this.attr.iconURL,
            url: this.attr.url,
        })
    }
}
