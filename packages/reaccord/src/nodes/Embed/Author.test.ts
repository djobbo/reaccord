import { AuthorNode } from "./Author"
import { EmbedBuilder } from "discord.js"
import { TextNode } from "../Text"

describe("AuthorNode", () => {
	it("should render", () => {
		const embed = new EmbedBuilder()
		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": undefined,
		    "name": "Author",
		    "url": undefined,
		  },
		}
	`)
	})

	it("should render with author icon", () => {
		const embed = new EmbedBuilder()
		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.attr.iconURL = "https://example.com/icon.png"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": "https://example.com/icon.png",
		    "name": "Author",
		    "url": undefined,
		  },
		}
	`)
	})

	it("should render with author url", () => {
		const embed = new EmbedBuilder()
		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.attr.url = "https://example.com"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": undefined,
		    "name": "Author",
		    "url": "https://example.com",
		  },
		}
	`)
	})

	it("should render with author icon and author url", () => {
		const embed = new EmbedBuilder()
		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.attr.iconURL = "https://example.com/icon.png"
		node.attr.url = "https://example.com"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": "https://example.com/icon.png",
		    "name": "Author",
		    "url": "https://example.com",
		  },
		}
	`)
	})

	it("should override author", () => {
		const embed = new EmbedBuilder()
		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.attr.iconURL = "https://example.com/icon.png"
		node.attr.url = "https://example.com"
		node.render(embed)

		node.children = [new TextNode("Author 2")]
		node.attr.iconURL = "https://example.com/icon2.png"
		node.attr.url = "https://example.com/2"
		node.render(embed)

		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": "https://example.com/icon2.png",
		    "name": "Author 2",
		    "url": "https://example.com/2",
		  },
		}
	`)
	})

	it("should reset author if author is not set", () => {
		const embed = new EmbedBuilder()

		const node = new AuthorNode()

		node.children = [new TextNode("Author")]
		node.attr.iconURL = "https://example.com/icon.png"
		node.attr.url = "https://example.com"
		node.render(embed)
		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": Object {
		    "icon_url": "https://example.com/icon.png",
		    "name": "Author",
		    "url": "https://example.com",
		  },
		}
	`)

		node.children = []
		node.render(embed)
		expect(embed).toMatchInlineSnapshot(`
		Object {
		  "author": undefined,
		}
	`)
	})
})
