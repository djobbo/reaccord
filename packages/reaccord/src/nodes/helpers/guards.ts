import { TextNode } from "../Text"
import type { ActionRowNode } from "../ActionRow"
import type { EmbedNode } from "../Embed"
import type { ModalNode } from "../Modal"
import type { Node } from "../Node"

export const isActionRowNode = (node: Node): node is ActionRowNode =>
  node.type === "ActionRow"

export const isModalNode = (node: Node): node is ModalNode =>
  node.type === "Modal"

export const isTextNode = (node: Node): node is TextNode =>
  node instanceof TextNode

export const isEmbedNode = (node: Node): node is EmbedNode =>
  node.type === "Embed"
