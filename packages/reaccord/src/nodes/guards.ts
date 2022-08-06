import type { ActionRowNode } from "./Interaction/ActionRow"
import type { AuthorNode } from "./Embed/Author"
import type { BaseNode } from "./_Base"
import type { BrNode } from "./Content/Br"
import type { ButtonNode } from "./Interaction/Button"
import type { CodeNode } from "./Content/Code"
import type { CodeblockNode } from "./Content/Codeblock"
import type { ColorNode } from "./Embed/Color"
import type { ContentNode } from "./Content/Content"
import type { DescNode } from "./Embed/Desc"
import type { EmbedNode } from "./Embed/Embed"
import type { FieldNode } from "./Embed/Field"
import type { FileNode } from "./File"
import type { FooterNode } from "./Embed/Footer"
import type { ImageNode } from "./Image"
import type { InputNode } from "./Interaction/Input"
import type { LinkNode } from "./Content/Link"
import type { ModalNode } from "./Interaction/Modal"
import type { ModalRootNode } from "./Interaction/ModalRoot"
import type { ModalRowNode } from "./Interaction/ModalRow"
import type { OptionNode } from "./Interaction/Option"
import type { RootNode } from "./Root"
import type { SelectNode } from "./Interaction/Select"
import type { SpanNode } from "./Content/Span"
import type { TextNode } from "./Text"
import type { ThumbNode } from "./Embed/Thumb"
import type { TimestampNode } from "./Embed/Timestamp"
import type { TitleNode } from "./Title"
import type { UrlNode } from "./Embed/Url"

export const isRootNode = (node: BaseNode): node is RootNode =>
  node.type === "Root"

export const isTitleNode = (node: BaseNode): node is TitleNode =>
  node.type === "Title"

export const isLinkNode = (node: BaseNode): node is LinkNode =>
  node.type === "Link"

export const isCodeNode = (node: BaseNode): node is CodeNode =>
  node.type === "Code"

export const isCodeblockNode = (node: BaseNode): node is CodeblockNode =>
  node.type === "CodeBlock"

export const isContentNode = (node: BaseNode): node is ContentNode =>
  node.type === "Content"

export const isBrNode = (node: BaseNode): node is BrNode => node.type === "Br"

export const isSpanNode = (node: BaseNode): node is SpanNode =>
  node.type === "Span"

export const isAuthorNode = (node: BaseNode): node is AuthorNode =>
  node.type === "Author"

export const isColorNode = (node: BaseNode): node is ColorNode =>
  node.type === "Color"

export const isDescNode = (node: BaseNode): node is DescNode =>
  node.type === "Desc"

export const isEmbedNode = (node: BaseNode): node is EmbedNode =>
  node.type === "Embed"

export const isFieldNode = (node: BaseNode): node is FieldNode =>
  node.type === "Field"

export const isFooterNode = (node: BaseNode): node is FooterNode =>
  node.type === "Footer"

export const isImageNode = (node: BaseNode): node is ImageNode =>
  node.type === "Image"

export const isThumbNode = (node: BaseNode): node is ThumbNode =>
  node.type === "Thumb"

export const isTimestampNode = (node: BaseNode): node is TimestampNode =>
  node.type === "Timestamp"

export const isUrlNode = (node: BaseNode): node is UrlNode =>
  node.type === "Url"

export const isActionRowNode = (node: BaseNode): node is ActionRowNode =>
  node.type === "ActionRow"

export const isButtonNode = (node: BaseNode): node is ButtonNode =>
  node.type === "Button"

export const isInputNode = (node: BaseNode): node is InputNode =>
  node.type === "Input"

export const isModalNode = (node: BaseNode): node is ModalNode =>
  node.type === "Modal"

export const isModalRowNode = (node: BaseNode): node is ModalRowNode =>
  node.type === "ModalRow"

export const isOptionNode = (node: BaseNode): node is OptionNode =>
  node.type === "Option"

export const isSelectNode = (node: BaseNode): node is SelectNode =>
  node.type === "Select"

export const isTextNode = (node: BaseNode): node is TextNode =>
  node.type === "Text"

export const isModalRootNode = (node: BaseNode): node is ModalRootNode =>
  node.type === "ModalRoot"

export const isFileNode = (node: BaseNode): node is FileNode =>
  node.type === "File"
