import { BaseNode } from "../_Base"
import { Embed } from "discord.js"
import type { FieldNode } from "./Field"
import type { RootNode } from "../Root"
import type { ThumbnailNode } from "./Thumbnail"
import type { TitleNode } from "../Title"

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
