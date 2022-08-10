import {
  ActionRowNode,
  AuthorNode,
  BrNode,
  ButtonNode,
  CodeNode,
  CodeblockNode,
  ColorNode,
  ContentNode,
  DescNode,
  EmbedNode,
  FieldNode,
  FileNode,
  FooterNode,
  ImageNode,
  InputNode,
  LinkNode,
  ModalNode,
  ModalRowNode,
  OptionNode,
  SelectNode,
  SpanNode,
  ThumbNode,
  TimestampNode,
  TitleNode,
  UrlNode,
} from "../nodes"
import type { NodeType } from "../nodes"

export const createNodeFromTag = (tag: NodeType) => {
  switch (tag) {
    case "ActionRow":
      return new ActionRowNode()
    case "Link":
      return new LinkNode()
    case "Author":
      return new AuthorNode()
    case "Desc":
      return new DescNode()
    case "Button":
      return new ButtonNode()
    case "Code":
      return new CodeNode()
    case "CodeBlock":
      return new CodeblockNode()
    case "Color":
      return new ColorNode()
    case "Content":
      return new ContentNode()
    case "Footer":
      return new FooterNode()
    case "Embed":
      return new EmbedNode()
    case "Field":
      return new FieldNode()
    case "Input":
      return new InputNode()
    case "Br":
      return new BrNode()
    case "Modal":
      return new ModalNode()
    case "ModalRow":
      return new ModalRowNode()
    case "Option":
      return new OptionNode()
    case "Select":
      return new SelectNode()
    case "Span":
      return new SpanNode()
    case "Thumb":
      return new ThumbNode()
    case "Title":
      return new TitleNode()
    case "Url":
      return new UrlNode()
    case "Timestamp":
      return new TimestampNode()
    case "Image":
      return new ImageNode()
    case "File":
      return new FileNode()
    default:
      throw new Error(`<${tag}/> is not yet implemented :(`)
  }
}
