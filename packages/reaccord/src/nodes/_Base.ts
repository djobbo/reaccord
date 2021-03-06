import { isRootNode } from "./guards"
import { randomUUID } from "node:crypto"
import type { JSX } from "../../jsx-runtime"
import type { ModalRootNode } from "./Interaction/ModalRoot"
import type { RootNode } from "./Root"

export type NodeType =
    | keyof JSX.IntrinsicElements
    | "textnode"
    | "root"
    | "modal-root"

export type BaseNodeDisplay = {
    uuid: string
    type: NodeType
    children: BaseNodeDisplay[]
    props: any
}

export abstract class BaseNode<
    Type extends NodeType = NodeType,
    ParentNodeType extends BaseNode = any,
    ChildrenNodeType extends BaseNode = any,
> {
    uuid: string

    type: Type

    children: ChildrenNodeType[] = []

    parent: ParentNodeType | null = null

    // @ts-expect-error
    attr: Type extends keyof JSX.IntrinsicElements
        ? Partial<JSX.IntrinsicElements[Type]>
        : {} = {}

    constructor(type: Type) {
        this.uuid = randomUUID()
        this.type = type
        this.children = []
    }

    setParent(node: ParentNodeType): void {
        this.parent = node
        this.onNodeRender()
    }

    insertBefore(node: ChildrenNodeType, anchor?: BaseNode): void {
        if (!node) throw new Error("Wrong child type")
        if (anchor) {
            const anchorIndex = this.children.findIndex(
                (child) => anchor === child,
            )
            this.children.splice(anchorIndex, 0, node)
        } else this.children.push(node)

        node.setParent(this)
    }

    setAttribute(name: string, value: any): void {
        // @ts-expect-error
        this.attr[name] = value
    }

    replaceAttributes(attr: Record<string, any>): void {
        // @ts-expect-error
        this.attr = attr
        this.onNodeRender()
    }

    get rootNode(): RootNode | ModalRootNode | undefined {
        // Could be slow if element is deeply nested, maybe cache this in local variable
        return this.parent?.rootNode
    }

    get parentNode(): ParentNodeType {
        if (!this.parent) throw new TypeError(`Couldn't find parent of ${this}`)
        return this.parent
    }

    get firstChild(): ChildrenNodeType | undefined {
        return this.children[0]
    }

    get nextSibling(): ParentNodeType["children"][number] | undefined {
        const parent = this.parentNode
        if (!parent) throw new TypeError(`Couldn't find parent of ${this}`)

        const nodeIndex = parent.children.findIndex((child) => child === this)

        if (nodeIndex < 0) throw new TypeError(`Bad node ${this}`)

        return parent.children[nodeIndex + 1]
    }

    removeChild(node: ChildrenNodeType): void {
        this.children = this.children.filter((child) => child !== node)
    }

    clear(): void {
        this.children = []
    }

    onNodeRender(): void {
        if (!this.rootNode || !isRootNode(this.rootNode)) return
        this.rootNode.onNodeRender()
    }

    get display(): BaseNodeDisplay {
        return {
            uuid: this.uuid,
            type: this.type,
            props: this.attr,
            children: this.children.map((child) => child.display),
        }
    }

    toString(): string {
        return JSON.stringify(this.display, null, 2)
    }

    abstract render(parent?: unknown): unknown
}
