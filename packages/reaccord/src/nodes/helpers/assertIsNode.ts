import type { Node } from "../Node"
import type { NodeElement } from "../elements"

export function assertIsNode<T extends NodeElement>(
  node: Node,
  type: T | T[],
): asserts node is Node<T> {
  if (Array.isArray(type) ? type.includes(node.type as T) : node.type === type)
    return
  throw new Error(
    `Unexpected node type: ${node.type}, expected: ${
      Array.isArray(type) ? type.join(" or ") : type
    }`,
  )
}
