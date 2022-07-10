import { AnchorNode } from "./Anchor"
import { TextNode } from "../Text"

describe("AnchorNode", () => {
    it("should render", () => {
        const node = new AnchorNode()

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
        const node = new AnchorNode()

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
