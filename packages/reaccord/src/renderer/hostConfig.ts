import { TextNode } from "../nodes/Text"
import { createNodeFromTag } from "./createNodeFromTag"
import { isTextNode } from "../nodes/helpers/guards"
import type { HostConfig } from "react-reconciler"
import type { Node } from "../nodes/Node"
import type { ReaccordElement } from "../nodes/elements"
import type { RootNode } from "../nodes/Root"

export const getHostConfig = (
  rootNode: RootNode,
): HostConfig<
  ReaccordElement,
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  Node,
  Node,
  TextNode,
  unknown,
  unknown,
  unknown,
  null,
  true,
  unknown,
  unknown,
  unknown
> => ({
  getChildHostContext: () => null,
  prepareForCommit: () => null,
  resetAfterCommit() {},
  createInstance: (tag, attr) => {
    const node = createNodeFromTag(tag, rootNode)
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
  createTextInstance: (textContent: string) =>
    new TextNode("Text", rootNode, textContent),
  commitMount() {},
  commitUpdate(node, _updatePayload, _tag, _oldAttr, attr) {
    node.replaceAttributes(attr)
  },
  resetTextContent(textNode: TextNode) {
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
  insertBefore(parent, node, anchor?: Node) {
    parent.insertBefore(node, anchor)
  },
  insertInContainerBefore(parent, node, anchor?: Node) {
    parent.insertBefore(node, anchor)
  },
  removeChild(parent, node: Node) {
    parent.removeChild(node)
  },
  removeChildFromContainer(parent, node: Node) {
    parent.removeChild(node)
  },
  hideInstance() {},
  hideTextInstance() {},
  unhideInstance() {},
  unhideTextInstance() {},
  clearContainer(node: Node) {
    node.clear()
  },
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
  getCurrentEventPriority: () => 99,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => null,
  afterActiveInstanceBlur: () => null,
  prepareScopeUpdate: () => null,
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => null,
})
