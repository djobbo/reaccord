import { SpanNode } from "./Span"
import { TextNode } from "../Text"

describe("SpanNode", () => {
	it("should render", () => {
		const node = new SpanNode()

		node.children = [new TextNode("Example")]
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("Example")

		node.children = [new TextNode("Example2 "), new TextNode("Blabla")]
		expect(node.innerText).toBe("Example2 Blabla")
		expect(node.render()).toBe("Example2 Blabla")
	})

	it("should render empty string if there is no inner content", () => {
		const node = new SpanNode()

		node.children = []
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")
	})

	it("should render bold text", () => {
		const node = new SpanNode()

		node.children = [new TextNode("Example")]
		node.attr.bold = true
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("**Example**")

		node.children = []
		node.attr.bold = true
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")
	})

	it("should render italic text", () => {
		const node = new SpanNode()

		node.children = [new TextNode("Example")]
		node.attr.italic = true
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("_Example_")

		node.children = []
		node.attr.italic = true
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")
	})

	it("should render italic and bold text", () => {
		const node = new SpanNode()

		node.children = [new TextNode("Example")]
		node.attr.bold = true
		node.attr.italic = true
		expect(node.innerText).toBe("Example")
		expect(node.render()).toBe("**_Example_**")

		node.children = []
		node.attr.bold = true
		node.attr.italic = true
		expect(node.innerText).toBe("")
		expect(node.render()).toBe("")
	})
})
