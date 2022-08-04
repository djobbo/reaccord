import { LinkNode } from "./Link"
import { TextNode } from "../Text"

describe("LinkNode", () => {
	it("should render", () => {
		const node = new LinkNode()

		node.children = [new TextNode("Example")]
		node.attr.href = "https://example.com"
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("[Example](https://example.com)")

		node.children = [new TextNode("Example2 "), new TextNode("Blabla")]
		node.attr.href = "https://example2.com"
		expect(node.innerText).toBe("Example2 Blabla")
		expect(node.render()).toBe("[Example2 Blabla](https://example2.com)")
	})

	it("should render empty string if no href attr or there is no inner content", () => {
		const node = new LinkNode()

		node.children = []
		node.attr.href = "https://example.com"
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")

		node.children = [new TextNode("Example")]
		node.attr.href = undefined
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("")

		node.children = []
		node.attr.href = undefined
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")
	})
})
