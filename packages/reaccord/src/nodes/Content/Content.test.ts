import { ContentNode } from "./Content"
import { TextNode } from "../Text"

describe("ContentNode", () => {
  it("should render", () => {
    const node = new ContentNode()

    node.children = [new TextNode("Example")]
    expect(node.innerText).toBe("Example")
    expect(node.render()).toBe("Example")

    node.children = [new TextNode("Example2 "), new TextNode("Blabla")]
    expect(node.innerText).toBe("Example2 Blabla")
    expect(node.render()).toBe("Example2 Blabla")
  })

  it("should render empty string if there is no inner content", () => {
    const node = new ContentNode()

    node.children = []
    expect(node.innerText).toBe("")
    expect(node.render()).toBe("")
  })
})
