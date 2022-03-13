import type { ActionRowNode } from "./Interaction/ActionRow"
import type { AnchorNode } from "./Content/Anchor"
import type { AuthorNode } from "./Embed/Author"
import type { BaseNode } from "./_Base"
import type { ButtonNode } from "./Interaction/Button"
import type { CodeNode } from "./Content/Code"
import type { CodeblockNode } from "./Content/Codeblock"
import type { ColorNode } from "./Embed/Color"
import type { ContentNode } from "./Content/Content"
import type { DescriptionNode } from "./Embed/Description"
import type { EmbedNode } from "./Embed/Embed"
import type { FieldNode } from "./Embed/Field"
import type { FooterNode } from "./Embed/Footer"
import type { ImageNode } from "./Embed/Image"
import type { InputNode } from "./Interaction/Input"
import type { LineBreakNode } from "./Content/LineBreak"
import type { ModalNode } from "./Interaction/Modal"
import type { ModalRootNode } from "./Interaction/ModalRoot"
import type { ModalRowNode } from "./Interaction/ModalRow"
import type { OptionNode } from "./Interaction/Option"
import type { RootNode } from "./Root"
import type { SelectNode } from "./Interaction/Select"
import type { SpanNode } from "./Content/Span"
import type { TextNode } from "./Text"
import type { ThumbnailNode } from "./Embed/Thumbnail"
import type { TimestampNode } from "./Embed/Timestamp"
import type { TitleNode } from "./Title"
import type { UrlNode } from "./Embed/Url"

export const isRootNode = (node: BaseNode): node is RootNode =>
    node.type === "root"

export const isTitleNode = (node: BaseNode): node is TitleNode =>
    node.type === "title"

export const isAnchorNode = (node: BaseNode): node is AnchorNode =>
    node.type === "a"

export const isCodeNode = (node: BaseNode): node is CodeNode =>
    node.type === "code"

export const isCodeblockNode = (node: BaseNode): node is CodeblockNode =>
    node.type === "codeblock"

export const isContentNode = (node: BaseNode): node is ContentNode =>
    node.type === "content"

export const isLineBreakNode = (node: BaseNode): node is LineBreakNode =>
    node.type === "br"

export const isSpanNode = (node: BaseNode): node is SpanNode =>
    node.type === "span"

export const isAuthorNode = (node: BaseNode): node is AuthorNode =>
    node.type === "author"

export const isColorNode = (node: BaseNode): node is ColorNode =>
    node.type === "color"

export const isDescriptionNode = (node: BaseNode): node is DescriptionNode =>
    node.type === "desc"

export const isEmbedNode = (node: BaseNode): node is EmbedNode =>
    node.type === "embed"

export const isFieldNode = (node: BaseNode): node is FieldNode =>
    node.type === "field"

export const isFooterNode = (node: BaseNode): node is FooterNode =>
    node.type === "footer"

export const isImageNode = (node: BaseNode): node is ImageNode =>
    node.type === "img"

export const isThumbnailNode = (node: BaseNode): node is ThumbnailNode =>
    node.type === "thumbnail"

export const isTimestampNode = (node: BaseNode): node is TimestampNode =>
    node.type === "timestamp"

export const isUrlNode = (node: BaseNode): node is UrlNode =>
    node.type === "url"

export const isActionRowNode = (node: BaseNode): node is ActionRowNode =>
    node.type === "action-row"

export const isButtonNode = (node: BaseNode): node is ButtonNode =>
    node.type === "button"

export const isInputNode = (node: BaseNode): node is InputNode =>
    node.type === "input"

export const isModalNode = (node: BaseNode): node is ModalNode =>
    node.type === "modal"

export const isModalRowNode = (node: BaseNode): node is ModalRowNode =>
    node.type === "modal-row"

export const isOptionNode = (node: BaseNode): node is OptionNode =>
    node.type === "option"

export const isSelectNode = (node: BaseNode): node is SelectNode =>
    node.type === "select"

export const isTextNode = (node: BaseNode): node is TextNode =>
    node.type === "textnode"

export const isModalRootNode = (node: BaseNode): node is ModalRootNode =>
    node.type === "modal-root"
