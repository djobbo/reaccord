import { LineBreakNode } from "./LineBreak"

describe("LineBreakNode", () => {
	it("should render", () => {
		const node = new LineBreakNode()

		expect(node.render()).toBe("\n")
	})
})
