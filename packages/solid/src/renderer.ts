import {
    ActionRowNode,
    AnchorNode,
    BaseNode,
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
    OptionNode,
    SelectNode,
    SpanNode,
    TextNode,
    ThumbnailNode,
    TitleNode,
} from "@reaccord/core"
import { JSX } from "@reaccord/core/jsx-runtime"
import { createRenderer } from "solid-js/universal"

//@ts-expect-error
export declare function render(code: () => JSX.Element, node: BaseNode): () => void

export const {
    //@ts-expect-error
    render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
} = createRenderer<BaseNode>({
    createElement(tag: keyof JSX.IntrinsicElements) {
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
    },
    createTextNode(textContent) {
        return new TextNode(textContent)
    },
    replaceText(textNode: TextNode, textContent) {
        textNode.setTextContent(textContent)
    },
    setProperty(node, property, value) {
        node.setAttribute(property, value)
    },
    insertNode(parent, node, anchor) {
        parent.insertBefore(node, anchor)
    },
    isTextNode(node) {
        return node instanceof TextNode
    },
    removeNode(parent, node) {
        parent.removeChild(node)
    },
    getParentNode(node) {
        return node.parentNode as BaseNode
    },
    getFirstChild(node) {
        return node.firstChild as BaseNode
    },
    getNextSibling(node) {
        return node.nextSibling as BaseNode
    },
})
