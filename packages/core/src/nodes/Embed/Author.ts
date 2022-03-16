import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class AuthorNode extends TextContainerNode<"author", EmbedNode> {
    constructor() {
        super("author")
    }

    render(embed: Embed): void {
        embed.setAuthor({
            name: this.innerText ?? EMPTY_STRING,
            iconURL: this.attr.iconURL,
            url: this.attr.url,
        })
    }
}