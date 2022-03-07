import {
    BaseNode,
    createNodeFromTag,
    ModalRootNode,
    NodeType,
    RootNode,
    TextNode,
} from "@reaccord/core"
import ReactReconciler from "react-reconciler"
import { JSX } from "../jsx-runtime"

const hostConfig = {
    now: Date.now,
    getRootHostContext: () => ({}),
    prepareForCommit: () => {},
    resetAfterCommit: () => {},
    getChildHostContext: () => ({}),
    shouldSetTextContent: (tag: NodeType, attr: any) =>
        attr.children === "string" || typeof attr.children === "number",
    createInstance: (tag: NodeType, attr: any) => {
        const node = createNodeFromTag(tag)

        Object.entries(attr).forEach(([key, val]) => {
            node.setAttribute(key, val)
        })

        return node
    },
    createTextInstance: (textContent: string) => new TextNode(textContent),
    appendInitialChild: (parent: BaseNode, node: BaseNode) => {
        parent.insertBefore(node)
    },
    appendChild(parent: BaseNode, node: BaseNode) {
        parent.insertBefore(node)
    },
    finalizeInitialChildren: () => {},
    supportsMutation: true,
    appendChildToContainer: (parent: BaseNode, node: BaseNode) => {
        parent.insertBefore(node)
    },
    prepareUpdate: () => true,
    commitUpdate: (
        node: BaseNode,
        _updatePayload: true,
        _type: NodeType,
        _oldAttr: any,
        attr: any
    ) => {
        node.attr = {}
        Object.entries(attr).forEach(([key, val]) => {
            node.setAttribute(key, val)
        })
    },
    commitTextUpdate: (textNode: TextNode, _oldTextContent: string, textContent: string) => {
        textNode.setTextContent(textContent)
    },
    removeChild(parent: BaseNode, node: BaseNode) {
        parent.removeChild(node)
    },
    clearContainer(node: BaseNode) {
        node.clear()
    }
}

const reactReconcilerInstance = ReactReconciler(hostConfig as any)

export const render = (code: () => JSX.Element, root: RootNode | ModalRootNode) => {
    const rootContainer = reactReconcilerInstance.createContainer(root, 0, false, null);
    reactReconcilerInstance.updateContainer(code(), rootContainer, null)
}
