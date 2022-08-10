import { CodeblockNode } from "./Codeblock"
import { TextNode } from "../Text"

describe("CodeblockNode", () => {
  it("should render", () => {
    const node = new CodeblockNode()

    node.children = [new TextNode("Example")]
    node.attr.lang = "ts"
    expect(node.innerText).toBe("Example")
    expect(node.render()).toBe(`\`\`\`ts\nExample\n\`\`\``)

    node.children = [new TextNode("Example2 "), new TextNode("Blabla")]
    node.attr.lang = "js"
    expect(node.innerText).toBe("Example2 Blabla")
    expect(node.render()).toBe(`\`\`\`js\nExample2 Blabla\n\`\`\``)
  })

  it("should render without lang if lang attr is not defined", () => {
    const node = new CodeblockNode()

    node.children = [new TextNode("Example")]
    node.attr.lang = undefined
    expect(node.innerText).toBe("Example")
    expect(node.render()).toBe(`\`\`\`\nExample\n\`\`\``)
  })

  it("should render empty string if there is no inner content", () => {
    const node = new CodeblockNode()

    node.children = []
    expect(node.innerText).toBe("")
    expect(node.render()).toBe("")
  })
})
