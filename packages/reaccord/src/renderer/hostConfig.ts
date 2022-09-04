import { Node } from "./Node"
import { TextNode } from "./TextNode"
import type { HostConfig } from "react-reconciler"
import type { RootNode } from "./RootNode"

export const hostConfig: HostConfig<
  string,
  Record<string, unknown>,
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
> = {
  getChildHostContext: () => null,
  prepareForCommit: () => null,
  resetAfterCommit(root: RootNode) {
    root.render()
  },
  createInstance: (tag, attr) => new Node(tag, attr),
  appendInitialChild: (parent, node) => {
    parent.insertBefore(node)
  },
  finalizeInitialChildren: () => false,
  prepareUpdate: () => true,
  shouldSetTextContent: () => false,
  createTextInstance: (textContent: string) => new TextNode(textContent),
  commitMount() {},
  commitUpdate(node, _updatePayload, _tag, _oldAttr, attr) {
    node.replaceAttributes(attr)
  },
  resetTextContent() {},
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
}
