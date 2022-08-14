import { isRootNode } from "./Root"
import { v4 as uuidv4 } from "uuid"
import type { ActionRowElements } from "./ActionRow"
import type { EmbedElements } from "./Embed"
import type { ModalElements } from "./Modal"
import type { RootNode } from "./Root"

type ReaccordElement = EmbedElements & ActionRowElements & ModalElements

type NodeElement = ReaccordElement & {
  Text: {}
  Root: {}
  ModalRoot: {}
}

export type NodeType = keyof NodeElement

export type BaseNodeDisplay = {
  uuid: string
  type: NodeType
  children: BaseNodeDisplay[]
  props: any
}

export function assertIsNode<T extends NodeType>(
  node: BaseNode,
  type: T | T[],
): asserts node is BaseNode<T> {
  if (Array.isArray(type) ? type.includes(node.type as T) : node.type === type)
    return
  throw new Error(
    `Unexpected node type: ${node.type}, expected: ${
      Array.isArray(type) ? type.join(" or ") : type
    }`,
  )
}

export function assertIsInstanceOf<T extends Function>(
  object: unknown,
  constructor: T,
): asserts object is T {
  if (object instanceof constructor) return
  throw new Error("Unexpected object type")
}

// const isNode = <T extends NodeType>(
//   node: BaseNode,
//   type: T,
// ): node is BaseNode<T> => node.type === type

export abstract class BaseNode<Type extends NodeType = NodeType> {
  uuid: string
  type: Type
  children: BaseNode[] = []
  parent: BaseNode | null = null

  props: Partial<NodeElement[Type]> = {}

  constructor(type: Type) {
    this.uuid = uuidv4()
    this.type = type
    this.children = []
  }

  setParent(node: BaseNode): void {
    this.parent = node
    this.onNodeUpdated()
  }

  insertBefore(node: BaseNode, anchor?: BaseNode): void {
    if (!node) throw new Error("Wrong child type")
    if (anchor) {
      const anchorIndex = this.children.findIndex((child) => anchor === child)
      this.children.splice(anchorIndex, 0, node)
    } else this.children.push(node)

    node.setParent(this)
  }

  setAttribute(name: string, value: any): void {
    // @ts-expect-error
    this.props[name] = value
    this.onNodeUpdated()
  }

  replaceAttributes(attr: Record<string, any>): void {
    // @ts-expect-error
    this.props = attr
    this.onNodeUpdated()
  }

  get rootNode(): RootNode | ModalRootNode | undefined {
    // Could be slow if element is deeply nested, maybe cache this in local variable
    return this.parent?.rootNode
  }

  get parentNode(): BaseNode {
    if (!this.parent) throw new TypeError(`Couldn't find parent of ${this}`)
    return this.parent
  }

  get firstChild(): BaseNode | undefined {
    return this.children[0]
  }

  get nextSibling(): BaseNode["children"][number] | undefined {
    const parent = this.parentNode
    if (!parent) throw new TypeError(`Couldn't find parent of ${this}`)

    const nodeIndex = parent.children.findIndex((child) => child === this)

    if (nodeIndex < 0) throw new TypeError(`Bad node ${this}`)

    return parent.children[nodeIndex + 1]
  }

  removeChild(node: BaseNode): void {
    this.children = this.children.filter((child) => child !== node)
  }

  clear(): void {
    this.children.map((child) => child.clear())
    this.children = []
  }

  onNodeUpdated(): void {
    if (!this.rootNode || !isRootNode(this.rootNode)) return
    this.rootNode.updateMessage()
  }

  get display(): BaseNodeDisplay {
    return {
      uuid: this.uuid,
      type: this.type,
      props: this.props,
      children: this.children.map((child) => child.display),
    }
  }

  toString(): string {
    return JSON.stringify(this.display, null, 2)
  }

  get innerText(): string {
    const innerText = this.children.map((child) => child.render()).join("")
    return innerText
  }

  get customId() {
    return "id" in this.props && this.props.id
      ? `${this.props.id}-${this.uuid}`
      : this.uuid
  }

  abstract render(parent?: unknown): unknown
}
