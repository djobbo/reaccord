import { BaseNode, NodeType } from "./nodes/_Base"
import { TextNode } from "./nodes/Text"
import { createRenderer } from "solid-js/universal"
import { JSX } from "../../jsx-runtime"
import { ActionRowNode } from "./nodes/ActionRow"
import { ButtonNode } from "./nodes/Button"
import { ContentNode } from "./nodes/Content"
import { EmbedNode } from "./nodes/Embed"
import { FieldNode } from "./nodes/Field"
import { InputNode } from "./nodes/Input"
import { ModalNode } from "./nodes/Modal"
import { ModalRowNode } from "./nodes/ModalRow"
import { TitleNode } from "./nodes/Title"
import { AnchorNode } from "./nodes/Anchor"
import { CodeNode } from "./nodes/Code"
import { CodeblockNode } from "./nodes/Codeblock"
import { SpanNode } from "./nodes/Span"
import { LineBreakNode } from "./nodes/LineBreak"

//@ts-expect-error
export declare function render(code: () => JSX.Element, node: BaseNode<NodeType>): () => void

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
            case "span":
                return new SpanNode()
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
