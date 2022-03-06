import { BaseNode } from "./_Base"
import { SelectMenuOption, Embed } from "discord.js"
import { EMPTY_STRING } from '../../constants'
import { EmbedNode } from './Embed'

export class ThumbnailNode extends BaseNode<"thumbnail", EmbedNode> {
    constructor() {
        super("thumbnail")
    }

    render(embed: Embed): void {
       embed.setThumbnail(this.attr.src ?? null)
    }
}

export const isThumbnailNode = (node: BaseNode): node is ThumbnailNode => node instanceof ThumbnailNode
