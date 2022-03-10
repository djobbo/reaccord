import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import { FieldNode } from "./Field"
import { RootNode } from "../Root"
import { ThumbnailNode } from "./Thumbnail"
import { TitleNode } from "../Title"

type EmbedChildren = TitleNode | FieldNode | ThumbnailNode

export class EmbedNode extends BaseNode<"embed", RootNode, EmbedChildren> {
    constructor() {
        super("embed")
    }

    render(): Embed {
        const newEmbed = new Embed()
        this.children.forEach((child) => child.render(newEmbed))
        return newEmbed
    }
}

export const isEmbedNode = (node: BaseNode): node is EmbedNode =>
    node instanceof EmbedNode
