import { RootNode } from "./Root"
import { TextContainerNode } from "./_TextContainer"
import { getFileFromAttachment } from "../helpers/getFileFromAttachment"
import type { EmbedBuilder } from "discord.js"
import type { EmbedNode } from "./Embed/Embed"
import type { FileAttachment } from "../jsx"

export class ImageNode extends TextContainerNode<
  "Image",
  EmbedNode | RootNode
> {
  constructor() {
    super("Image")
  }

  render(embed?: EmbedBuilder): void | FileAttachment {
    if (embed) {
      if ("src" in this.attr) {
        if (!this.attr.src) return
        embed.setImage(this.attr.src)
        return
      }

      if ("file" in this.attr) {
        if (!this.attr.file) return
        if (!(this.rootNode instanceof RootNode))
          throw new Error("Root node not found")

        const { file, filename } = getFileFromAttachment(
          this.attr.file,
          this.uuid,
        )

        this.rootNode.addFile(file)
        embed.setImage(filename)
      }
    }

    // TODO: add support for src outside of embed
    if ("src" in this.attr) {
      throw new Error(
        "Image src not yet supported outside of embed, use file instead",
      )
      // 	if (embed) throw new Error("Should be outside of embed")
      // 	if (!this.attr.src) return

      // 	return {
      // 		attachment: this.attr.src,
      // 		name: this.attr.src.split("/").pop() ?? `${uuidv4()}.png`
      // 	}
    }

    if ("file" in this.attr) {
      if (!this.attr.file) return

      const { file } = getFileFromAttachment(this.attr.file, this.uuid)

      return file
    }
  }
}
