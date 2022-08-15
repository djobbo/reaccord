import { EmbedBuilder } from "discord.js"
import { Node } from "./Node"
import { assertIsDefined } from "../helpers/asserts"
import { assertIsNode } from "./helpers/assertIsNode"
import type { RootNode } from "./Root"

export class EmbedNode extends Node<"Embed"> {
  constructor(rootNode: RootNode) {
    super("Embed", rootNode)
  }

  render(): EmbedBuilder {
    const embed = new EmbedBuilder({
      url: this.props.url,
    })
      .setTimestamp(this.props.timestamp)
      .setColor(this.props.color ?? null)

    this.children.forEach((child) => {
      switch (child.type) {
        case "Title":
          assertIsNode(child, "Title")
          embed.setTitle(child.innerText)
          return

        case "Description":
          assertIsNode(child, "Description")
          embed.setDescription(child.innerText)
          return

        case "Footer":
          assertIsNode(child, "Footer")
          embed.setFooter({
            text: child.innerText,
            iconURL: child.props.iconURL,
          })
          return

        case "Image":
          child.render(embed)
          return

        case "Thumbnail":
          child.render(embed)
          return

        case "Author":
          assertIsNode(child, "Author")
          assertIsDefined(child.props.name, "Author name is required")

          embed.setAuthor({
            name: child.props.name,
            url: child.props.url,
            iconURL: child.props.iconURL,
          })
          return

        case "Field":
          assertIsNode(child, "Field")
          assertIsDefined(child.props.title, "Field title is required")

          embed.addFields({
            name: child.props.title,
            value: child.innerText,
            inline: child.props.inline ?? false,
          })
          return

        default:
          throw new Error(`Unexpected element type: ${child.type} inside Embed`)
      }
    })

    return embed
  }
}
