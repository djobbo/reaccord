import { EMPTY_STRING } from "../../helpers/constants"
import { TextContainerNode } from "../_TextContainer"
import type { EmbedNode } from "./Embed"
import type { MessageEmbed } from "discord.js"

export class FooterNode extends TextContainerNode<"footer", EmbedNode> {
    constructor() {
        super("footer")
    }

    render(embed: MessageEmbed): void {
        embed.setFooter({
            text: this.innerText ?? EMPTY_STRING,
            iconURL: this.attr.iconURL,
        })
    }
}
