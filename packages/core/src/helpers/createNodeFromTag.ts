import {
    ActionRowNode,
    AnchorNode,
    AuthorNode,
    ButtonNode,
    CodeNode,
    CodeblockNode,
    ColorNode,
    ContentNode,
    DescriptionNode,
    EmbedNode,
    FieldNode,
    FooterNode,
    ImageNode,
    InputNode,
    LineBreakNode,
    MessageNode,
    ModalNode,
    ModalRowNode,
    OptionNode,
    SelectNode,
    SpanNode,
    ThumbnailNode,
    TimestampNode,
    TitleNode,
    UrlNode,
} from "../nodes"
import type { NodeType } from "../nodes"

export const createNodeFromTag = (tag: NodeType) => {
    switch (tag) {
        case "message":
            return new MessageNode()
        case "action-row":
            return new ActionRowNode()
        case "a":
            return new AnchorNode()
        case "author":
            return new AuthorNode()
        case "desc":
            return new DescriptionNode()
        case "button":
            return new ButtonNode()
        case "code":
            return new CodeNode()
        case "codeblock":
            return new CodeblockNode()
        case "color":
            return new ColorNode()
        case "content":
            return new ContentNode()
        case "footer":
            return new FooterNode()
        case "embed":
            return new EmbedNode()
        case "field":
            return new FieldNode()
        case "input":
            return new InputNode()
        case "br":
            return new LineBreakNode()
        case "modal":
            return new ModalNode()
        case "modal-row":
            return new ModalRowNode()
        case "option":
            return new OptionNode()
        case "select":
            return new SelectNode()
        case "span":
            return new SpanNode()
        case "thumbnail":
            return new ThumbnailNode()
        case "title":
            return new TitleNode()
        case "url":
            return new UrlNode()
        case "timestamp":
            return new TimestampNode()
        case "img":
            return new ImageNode()
        default:
            throw new Error(`<${tag}/> is not yet implemented :(`)
    }
}
