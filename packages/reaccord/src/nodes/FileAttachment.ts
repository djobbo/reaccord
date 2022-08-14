import { BaseNode, assertIsNode } from "./_Base"
import { EmbedBuilder } from "discord.js"
import { P, match } from "ts-pattern"
import { RootNode } from "./Root"
import { getFileFromAttachment } from "../helpers/getFileFromAttachment"
import type { Attachment, AttachmentBuilder } from "discord.js"
import type { Stream } from "node:stream"

export type FileAttachment =
  | Buffer
  | Stream
  | string
  | AttachmentBuilder
  | Attachment

type _FileAttachmentBase = { file: FileAttachment } | { src: string }

export type FileAttachmentElements = {
  File: _FileAttachmentBase
  Image: _FileAttachmentBase
  Thumbnail: _FileAttachmentBase
}

type FileAttachmentNodeTypes = keyof FileAttachmentElements

const isEmbedBuilder = (object: EmbedBuilder | null): object is EmbedBuilder =>
  object instanceof EmbedBuilder

type FileAttachmentParent = EmbedBuilder | null

export class FileAttachmentNode<
  FileAttachmentNodeType extends FileAttachmentNodeTypes = FileAttachmentNodeTypes,
> extends BaseNode<FileAttachmentNodeTypes> {
  constructor(type: FileAttachmentNodeType) {
    super(type)
  }

  render<Parent extends FileAttachmentParent>(
    parent: Parent,
  ): FileAttachment | void {
    const fileAttachment = match<
      Readonly<[FileAttachmentParent | null, Partial<_FileAttachmentBase>]>
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
          if (!(this.rootNode instanceof RootNode))
            throw new Error("Root node not found")

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

export function assertIsFileAttachmentNode<T extends FileAttachmentNodeTypes>(
  node: BaseNode,
  type: T | T[],
): asserts node is BaseNode<T> {
  assertIsNode(node, type)
}

export const isFileAttachmentNode = (
  node: BaseNode,
): node is FileAttachmentNode => node instanceof FileAttachmentNode
