import { BrNode } from "./Br"

describe("BrNode", () => {
  it("should render", () => {
    const node = new BrNode()

    expect(node.render()).toBe("\n")
  })
})
