import {
    BaseNode,
    NodeType,
    RenderFn,
    TextNode,
    createNodeFromTag,
} from "@reaccord/core"
import { JSX } from "../jsx-runtime"
import { MessageProvider } from "./MessageContext"
import ReactReconciler, { HostConfig } from "react-reconciler"

const hostConfig: HostConfig<
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
        if (textNode instanceof TextNode) textNode.setTextContent("")
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

const reactReconcilerInstance = ReactReconciler(hostConfig)

export const render: RenderFn = (Code, root, client, message) => {
    const rootContainer = reactReconcilerInstance.createContainer(
        root,
        0,
        false,
        null
    )
    reactReconcilerInstance.updateContainer(
        <MessageProvider message={message} client={client}>
            <Code />
        </MessageProvider>,
        rootContainer,
        null
    )
}
