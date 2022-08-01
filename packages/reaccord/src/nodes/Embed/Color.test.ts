import { ColorNode } from "./Color"
import { MessageEmbed } from "discord.js"

describe("ColorNode", () => {
	it("should render", () => {
		const embed = new MessageEmbed()
		const node = new ColorNode()

		node.attr.color = "#00ff00"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
            Object {
              "author": null,
              "color": 65280,
              "description": null,
              "fields": Array [],
              "footer": null,
              "image": null,
              "thumbnail": null,
              "timestamp": null,
              "title": null,
              "type": "rich",
              "url": null,
            }
        `)
	})

	it("should reset color if attr not set", () => {
		const embed = new MessageEmbed()
		const node = new ColorNode()

		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
            Object {
              "author": null,
              "color": 0,
              "description": null,
              "fields": Array [],
              "footer": null,
              "image": null,
              "thumbnail": null,
              "timestamp": null,
              "title": null,
              "type": "rich",
              "url": null,
            }
        `)
	})
})
