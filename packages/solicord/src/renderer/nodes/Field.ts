import { BaseNode } from "./_Base"
import { Embed } from "discord.js"
import { TextNode } from "./Text"
import { EmbedNode } from './Embed'
import { renderTextNode } from '../renderTextNode'

export class FieldNode extends BaseNode<"field", EmbedNode, TextNode> {
    constructor() {
        super("field")
    }

    render(embed: Embed): void {
        embed.addFields({
            name: renderTextNode(this.attr.title),
            value: renderTextNode(this.children),
            inline: this.attr.inline,
        })
        return
    }
}

export const isFieldNode = (node: BaseNode): node is FieldNode => node instanceof FieldNode
