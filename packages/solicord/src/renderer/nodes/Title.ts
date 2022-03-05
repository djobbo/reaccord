import { BaseNode } from "./_Base"
import { Embed } from "discord.js"
import { EmbedNode } from './Embed'
import { renderTextNode } from '../renderTextNode'
import { TextContainerNode } from './_TextContainer'

export class TitleNode extends TextContainerNode<"title", EmbedNode> {
    constructor() {
        super("title")
    }

    render(embed: Embed): void {
        embed.setTitle(this.innerText)
    }
}

export const isTitleNode = (node: BaseNode): node is TitleNode => node instanceof TitleNode
