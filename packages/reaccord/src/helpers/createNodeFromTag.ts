import { ActionRowNode } from "../nodes/ActionRow"
import { BaseNode } from "../nodes/_Base"
import { EmbedNode } from "../nodes/Embed"
import { FileAttachmentNode } from "../nodes/FileAttachment"
import { ModalNode } from "../nodes/Modal"
import { TextNode } from "../nodes/Text"
import type { ReaccordElement } from "../nodes/_Base"

const nodeGenerators: Record<ReaccordElement, () => BaseNode> = {
  ActionRow: () => new ActionRowNode(),
  Embed: () => new EmbedNode(),
  File: () => new FileAttachmentNode("File"),
  Image: () => new FileAttachmentNode("Image"),
  Thumbnail: () => new FileAttachmentNode("Thumbnail"),
  Modal: () => new ModalNode(),
  Author: () => new BaseNode("Author"),
  Button: () => new BaseNode("Button"),
  Description: () => new BaseNode("Description"),
  Field: () => new BaseNode("Field"),
  Footer: () => new BaseNode("Footer"),
  LinkButton: () => new BaseNode("LinkButton"),
  ModalRow: () => new BaseNode("ModalRow"),
  Option: () => new BaseNode("Option"),
  SelectMenu: () => new BaseNode("SelectMenu"),
  TextInput: () => new BaseNode("TextInput"),
  Title: () => new BaseNode("Title"),
  Br: () => new TextNode("Br"),
  Code: () => new TextNode("Code"),
  CodeBlock: () => new TextNode("CodeBlock"),
  Span: () => new TextNode("Span"),
  Link: () => new TextNode("Link"),
}

export const createNodeFromTag = (type: ReaccordElement) => {
  const node = nodeGenerators[type]()

  if (!node) throw new Error(`Unknown node type: ${type}`)

  return node
}
