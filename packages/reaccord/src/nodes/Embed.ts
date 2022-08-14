import { BaseNode, assertIsNode } from "./_Base"
import { EmbedBuilder } from "discord.js"
import { assertIsDefined } from "../helpers/asserts"
import { assertIsFileAttachmentNode } from "./FileAttachment"
import type { ColorResolvable } from "discord.js"
import type { ReactNode } from "react"

export type EmbedElements = {
  Embed: {
    children?: ReactNode
    url?: string
    timestamp?: Date | number | null
    color?: ColorResolvable
  }
  Title: {
    children?: ReactNode
  }
  Description: {
    children?: ReactNode
  }
  Footer: {
    children?: ReactNode
    iconURL?: string
  }
  // Not available in discord.js builders
  // Video: {
  //   url?: string
  //   height?: number
  //   width?: number
  // }
  // Not available in discord.js builders
  // Provider: {
  //   name?: string
  //   url?: ReactNode
  // }
  Author: {
    name: string
    url?: string
    iconURL?: string
  }
  Field: {
    title: string
    children?: ReactNode
    inline?: boolean
  }
}

export class EmbedNode extends BaseNode<"Embed"> {
  constructor() {
    super("Embed")
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
          assertIsFileAttachmentNode(child, "Image")
          child.render(embed)
          return

        case "Thumbnail":
          assertIsNode(child, "Thumbnail")
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

export const isEmbedNode = (node: BaseNode): node is EmbedNode =>
  node.type === "Embed"
