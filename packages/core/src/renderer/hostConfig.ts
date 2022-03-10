import { TextNode } from "../nodes"
import { createNodeFromTag } from "../helpers"
import { isTextNode } from "../nodes/guards"
import type { BaseNode, NodeType } from "../nodes"
import type { HostConfig } from "react-reconciler"
import type { JSX } from "../../jsx-runtime"

export const hostConfig: HostConfig<
    NodeType,
    JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
    BaseNode,
    BaseNode,
    TextNode,
    unknown,
    unknown,
    unknown,
    null,
    true,
    unknown,
    unknown,
    unknown
> = {
    getChildHostContext: () => null,
    prepareForCommit: () => null,
    resetAfterCommit() {},
    createInstance: (tag, attr) => {
        const node = createNodeFromTag(tag)
        node.replaceAttributes(attr)
        return node
    },
    appendInitialChild: (parent, node) => {
        parent.insertBefore(node)
    },
    finalizeInitialChildren: () => false,
    prepareUpdate: () => true,
    shouldSetTextContent: (_tag, attr: any) =>
        attr.children === "string" || typeof attr.children === "number",
    createTextInstance: (textContent: string) => new TextNode(textContent),
    commitMount() {},
    commitUpdate(node, _updatePayload, _tag, _oldAttr, attr) {
        node.replaceAttributes(attr)
    },
    resetTextContent(textNode) {
        if (isTextNode(textNode)) textNode.setTextContent("")
    },
    commitTextUpdate(textNode, _oldTextContent, textContent) {
        textNode.setTextContent(textContent)
    },
    appendChild(parent, node) {
        parent.insertBefore(node)
    },
    appendChildToContainer(parent, node) {
        parent.insertBefore(node)
    },
    insertBefore(parent, node, anchor?: BaseNode) {
        parent.insertBefore(node, anchor)
    },
    insertInContainerBefore(parent, node, anchor?: BaseNode) {
        parent.insertBefore(node, anchor)
    },
    removeChild(parent, node) {
        parent.removeChild(node)
    },
    removeChildFromContainer(parent, node) {
        parent.removeChild(node)
    },
    hideInstance() {},
    hideTextInstance() {},
    unhideInstance() {},
    unhideTextInstance() {},
    clearContainer(node: BaseNode) {
        node.clear()
    },
    now: Date.now,
    getRootHostContext: () => null,
    supportsMutation: true,
    supportsPersistence: false,
    getPublicInstance() {},
    preparePortalMount() {},
    scheduleTimeout() {},
    cancelTimeout() {},
    noTimeout: true,
    isPrimaryRenderer: true,
    supportsHydration: false,
}
