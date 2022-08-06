import { BaseNode } from "./_Base"
import type { NodeType } from "./_Base"
import type { TextNode } from "./Text"

export abstract class TextContainerNode<
  Type extends NodeType = NodeType,
  ParentNodeType extends BaseNode = any,
> extends BaseNode<Type, ParentNodeType, TextNode> {
  constructor(type: Type) {
    super(type)
  }

  get innerText(): string {
    return this.children.map((child) => child.render()).join("")
  }

  abstract render(parent?: unknown): unknown
}
