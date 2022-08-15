import { EmbedBuilder } from "discord.js"
import { Node } from "./Node"
import { P, match } from "ts-pattern"
import { getFileFromAttachment } from "./helpers/getFileFromAttachment"
import type { FileAttachment, FileAttachmentElements } from "./elements"
import type { RootNode } from "./Root"

const isEmbedBuilder = (object: EmbedBuilder | null): object is EmbedBuilder =>
  object instanceof EmbedBuilder

type FileAttachmentParent = EmbedBuilder | null

export class FileAttachmentNode<
  FileAttachmentNodeType extends keyof FileAttachmentElements = keyof FileAttachmentElements,
> extends Node<FileAttachmentNodeType> {
  constructor(type: FileAttachmentNodeType, rootNode: RootNode) {
    super(type, rootNode)
  }

  render<Parent extends FileAttachmentParent>(
    parent: Parent,
  ): FileAttachment | void {
    const fileAttachment = match<
      Readonly<
        [
          FileAttachmentParent | null,
          Partial<FileAttachmentElements[keyof FileAttachmentElements]>,
        ]
      >
    >([parent, this.props])
      // Add image to message (parent is null) via src
      .with([P.nullish, { src: P.string }], () => {
        throw new Error(
          "Image src not yet supported outside of embed, use file instead",
        )
      })
      // Add image to message (parent is null) via file attachment
      .with([P.nullish, { file: P.not(P.nullish) }], ([, { file }]) => file)
      // Add image to embed via src
      .with([P.when(isEmbedBuilder), { src: P.string }], ([embed, { src }]) => {
        switch (this.type) {
          case "Image":
            embed.setImage(src)
            return
          case "Thumbnail":
            embed.setThumbnail(src)
            return
          default:
            throw new Error("Invalid image attachment")
        }
      })
      // Add image to embed via file attachment
      .with(
        [P.when(isEmbedBuilder), { file: P.not(P.nullish) }],
        ([embed, { file: fileProp }]) => {
          if (!fileProp) return

          const { file, filename } = getFileFromAttachment(fileProp, this.uuid)

          this.rootNode.addFile(file)

          switch (this.type) {
            case "Image":
              embed.setImage(filename)
              return
            case "Thumbnail":
              embed.setThumbnail(filename)
              return
            default:
              throw new Error("Invalid image attachment")
          }
        },
      )
      .otherwise(() => {
        throw new Error("Invalid image attachment")
      })

    return fileAttachment
  }
}

export const isFileAttachmentNode = (node: Node): node is FileAttachmentNode =>
  node instanceof FileAttachmentNode
