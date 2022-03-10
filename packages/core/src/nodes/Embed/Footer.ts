import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { BaseNode } from "../_Base"
import type { Embed } from "discord.js"
import type { EmbedNode } from "./Embed"

export class FooterNode extends TextContainerNode<"footer", EmbedNode> {
    constructor() {
        super("footer")
    }

    render(embed: Embed): void {
        embed.setFooter({
            text: this.innerText ?? EMPTY_STRING,
            iconURL: this.attr.iconURL,
        })
    }
}
