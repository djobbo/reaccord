import { isNodeType, BaseNode } from "./nodes/_Base"
import { JSX } from "../../jsx-runtime"
import { TextNode } from './nodes/Text'

export const renderTextNode = (node: JSX.Element): string => {
    if (!node) return ""
    if (Array.isArray(node)) return node.map((n) => renderTextNode(n)).join("")
    if (typeof node === "function") return renderTextNode(node())
    if (!(node instanceof BaseNode)) return node.toString()

    if (node instanceof TextNode) return node.textContent

    if (isNodeType("a")(node)) return `[${renderTextNode(node.children)}](${node.attr.href})`

    if (isNodeType("code")(node)) return `\`${renderTextNode(node.children)}\``

    if (isNodeType("codeblock")(node))
        return `\`\`\`${node.attr.lang}\n${renderTextNode(node.children)}\n\`\`\``

    if (isNodeType("span")(node)) {
        let str = renderTextNode(node.children)
        if (node.attr.italic) str = `_${str}_`
        if (node.attr.bold) str = `**${str}**`
        return str
    }

    if (isNodeType("br")(node)) return "\n"

    return ""
}
