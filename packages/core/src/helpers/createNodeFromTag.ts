import {
    ActionRowNode,
    AnchorNode,
    ButtonNode,
    CodeblockNode,
    CodeNode,
    ColorNode,
    ContentNode,
    EmbedNode,
    FieldNode,
    InputNode,
    LineBreakNode,
    ModalNode,
    ModalRowNode,
    NodeType,
    OptionNode,
    SelectNode,
    SpanNode,
    ThumbnailNode,
    TitleNode,
} from "../nodes"

export const createNodeFromTag = (tag: NodeType) => {
    switch (tag) {
        case "action-row":
            return new ActionRowNode()
        case "a":
            return new AnchorNode()
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
        default:
            throw new Error(`<${tag}/> is not yet implemented :(`)
    }
}
