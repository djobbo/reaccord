import { BaseNode, createNodeFromTag, TextNode } from "@reaccord/core"
import { JSX } from "../jsx-runtime"
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
        return createNodeFromTag(tag)
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
