import { ActionRowNode } from "../nodes/ActionRow"
import { EmbedNode } from "../nodes/Embed"
import { FileAttachmentNode } from "../nodes/FileAttachment"
import { ModalNode } from "../nodes/Modal"
import { Node } from "../nodes/Node"
import { TextNode } from "../nodes/Text"
import type { ReaccordElement } from "../nodes/elements"
import type { RootNode } from "../nodes/Root"

const nodeGenerators: Record<ReaccordElement, (rootNode: RootNode) => Node> = {
  ActionRow: (root) => new ActionRowNode(root),
  Embed: (root) => new EmbedNode(root),
  File: (root) => new FileAttachmentNode("File", root),
  Image: (root) => new FileAttachmentNode("Image", root),
  Thumbnail: (root) => new FileAttachmentNode("Thumbnail", root),
  Modal: (root) => new ModalNode(root),
  Author: (root) => new Node("Author", root),
  Button: (root) => new Node("Button", root),
  Description: (root) => new Node("Description", root),
  Field: (root) => new Node("Field", root),
  Footer: (root) => new Node("Footer", root),
  LinkButton: (root) => new Node("LinkButton", root),
  ModalRow: (root) => new Node("ModalRow", root),
  Option: (root) => new Node("Option", root),
  SelectMenu: (root) => new Node("SelectMenu", root),
  TextInput: (root) => new Node("TextInput", root),
  Title: (root) => new Node("Title", root),
  Br: (root) => new TextNode("Br", root),
  Code: (root) => new TextNode("Code", root),
  CodeBlock: (root) => new TextNode("CodeBlock", root),
  Span: (root) => new TextNode("Span", root),
  Link: (root) => new TextNode("Link", root),
}

export const createNodeFromTag = (type: ReaccordElement, root: RootNode) => {
  const node = nodeGenerators[type](root)

  if (!node) throw new Error(`Unknown node type: ${type}`)

  return node
}
