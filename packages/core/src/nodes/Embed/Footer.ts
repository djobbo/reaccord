import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { EmbedNode } from "./Embed"
import { TextContainerNode } from "../_TextContainer"
import { EMPTY_STRING } from "../../constants"

export class FooterNode extends TextContainerNode<"footer", EmbedNode> {
    constructor() {
        super("footer")
    }

    render(embed: Embed): void {
        embed.setFooter({
            text: this.innerText ?? EMPTY_STRING,
            iconURL: this.attr.iconURL
        })
    }
}

export const isFooterNode = (node: BaseNode): node is FooterNode => node instanceof FooterNode
