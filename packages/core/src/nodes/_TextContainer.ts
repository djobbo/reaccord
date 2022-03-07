import { randomUUID } from "node:crypto"
import { TextNode } from "./Text"
import { BaseNode, NodeType } from "./_Base"

export abstract class TextContainerNode<
    Type extends NodeType = NodeType,
    ParentNodeType extends BaseNode = BaseNode
> extends BaseNode<Type, ParentNodeType, TextNode> {
    constructor(type: Type) {
        super(type)
    }

    get innerText(): string {
        return this.children.map((child) => child.render()).join("")
    }

    abstract render(parent?: unknown): unknown
}
