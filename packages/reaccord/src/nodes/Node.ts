import { assertIsNode } from "./helpers/assertIsNode"
import { v4 as uuidv4 } from "uuid"
import type { NodeElement, NodeElements } from "./elements"
import type { RootNode } from "./Root"

export type NodeDisplay = {
  uuid: string
  type: NodeElement
  children: NodeDisplay[]
  props: any
}

export class Node<Type extends NodeElement = NodeElement> {
  uuid: string
  type: Type
  children: Node[] = []
  rootNode: RootNode
  parent: Node | null = null

  props: Partial<NodeElements[Type]> = {}

  constructor(type: Type, rootNode: RootNode) {
    this.uuid = uuidv4()
    this.type = type
    this.rootNode = rootNode
    this.children = []
  }

  setParent(node: Node): void {
    this.parent = node
    this.onNodeUpdated()
  }

  insertBefore(node: Node, anchor?: Node): void {
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

  get parentNode(): Node {
    if (!this.parent) throw new TypeError(`Couldn't find parent of ${this}`)
    return this.parent
  }

  get firstChild(): Node | undefined {
    return this.children[0]
  }

  get nextSibling(): Node["children"][number] | undefined {
    const parent = this.parentNode
    if (!parent) throw new TypeError(`Couldn't find parent of ${this}`)

    const nodeIndex = parent.children.findIndex((child) => child === this)

    if (nodeIndex < 0) throw new TypeError(`Bad node ${this}`)

    return parent.children[nodeIndex + 1]
  }

  removeChild(node: Node): void {
    this.children = this.children.filter((child) => child !== node)
  }

  clear(): void {
    this.children.map((child) => child.clear())
    this.children = []
  }

  get innerText(): string {
    const innerText = this.children
      .map((child) => child.renderAsText())
      .join("")
    return innerText
  }

  onNodeUpdated(): void {
    // TODO: not the best way to do this
    this.parent?.onNodeUpdated()
  }

  get display(): NodeDisplay {
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

  renderAsText(): string {
    return ""
  }

  get customId(): string {
    assertIsNode(this, ["Button", "SelectMenu", "Modal"])

    return (
      (this.props as Node<"Button" | "SelectMenu" | "Modal">["props"]).id ??
      this.uuid
    )
  }

  render(parent?: unknown): unknown {
    throw new Error(`Render method not implemented for ${this.type}`)
  }
}
