import { BaseNode } from "./_Base"
import { Embed } from "discord.js"
import { TextNode } from "./Text"
import { EmbedNode } from './Embed'
import { renderTextNode } from '../renderTextNode'

export class TitleNode extends BaseNode<"title", EmbedNode, TextNode> {
    constructor() {
        super("title")
    }

    render(embed: Embed): void {
        embed.setTitle(this.children.map((child) => renderTextNode(child)).join(""))
    }
}

export const isTitleNode = (node: BaseNode): node is TitleNode => node instanceof TitleNode
