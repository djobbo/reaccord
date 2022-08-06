import { ColorNode } from "./Color"
import { EmbedBuilder } from "discord.js"

describe("ColorNode", () => {
	it("should render", () => {
		const embed = new EmbedBuilder()
		const node = new ColorNode()

		node.attr.color = "#00ff00"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "color": 65280,
		}
	`)
	})

	it("should reset color if attr not set", () => {
		const embed = new EmbedBuilder()
		const node = new ColorNode()

		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "color": 0,
		}
	`)
	})
})
