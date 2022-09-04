import { v4 as uuidv4 } from "uuid"
import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageComponentInteraction,
  ModalSubmitInteraction,
  TextBasedChannel,
} from "discord.js"

export type InteractionRefType =
  | TextBasedChannel
  | Message
  | ChatInputCommandInteraction
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MessageComponentInteraction
  | ModalSubmitInteraction

export class Node<Props = Record<string, unknown>> {
  uuid: string
  type: string
  children: Node[] = []
  root: Node | null = null
  parent: Node | null = null

  props: Partial<Props>

  constructor(type: string, props?: Partial<Props>) {
    this.uuid = uuidv4()
    this.type = type
    this.children = []
    this.props = props || {}
  }

  setParent(node: Node): void {
    this.parent = node
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
    this.props[name as keyof Props] = value
  }

  replaceAttributes(attr: Record<string, any>): void {
    this.props = attr as Props
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
}
