import type { FC } from "react"
import type { ReaccordElements } from "./nodes/elements"

export { Client } from "./Client"
export {
  ChatInputCommand,
  MessageContextCommand,
  UserContextCommand,
} from "./Command"
export * from "./react"
export * from "discord.js"
export { renderMessage } from "./renderer"

export type ReaccordConfig = {
  /**
   * Entry point for the bot.
   */
  entry: string
}

type ReaccordComponent<T extends keyof ReaccordElements> = FC<
  ReaccordElements[T] & { "test-id"?: string }
>

// Reaccord Elements
// TODO: add a script that checks if all elements are correctly exported
// Text
export const Br = "Br" as unknown as ReaccordComponent<"Br">
export const Code = "Code" as unknown as ReaccordComponent<"Code">
export const CodeBlock =
  "CodeBlock" as unknown as ReaccordComponent<"CodeBlock">
export const Span = "Span" as unknown as ReaccordComponent<"Span">
export const Link = "Link" as unknown as ReaccordComponent<"Link">

// Embed
export const Embed = "Embed" as unknown as ReaccordComponent<"Embed">
export const Author = "Author" as unknown as ReaccordComponent<"Author">
export const Description =
  "Description" as unknown as ReaccordComponent<"Description">
export const Footer = "Footer" as unknown as ReaccordComponent<"Footer">

export const Image = "Image" as unknown as ReaccordComponent<"Image">
export const Thumbnail =
  "Thumbnail" as unknown as ReaccordComponent<"Thumbnail">
export const Title = "Title" as unknown as ReaccordComponent<"Title">
export const Field = "Field" as unknown as ReaccordComponent<"Field">

// Interaction Components
export const ActionRow =
  "ActionRow" as unknown as ReaccordComponent<"ActionRow">
export const ModalRow = "ModalRow" as unknown as ReaccordComponent<"ModalRow">
export const Button = "Button" as unknown as ReaccordComponent<"Button">
export const LinkButton =
  "LinkButton" as unknown as ReaccordComponent<"LinkButton">
export const SelectMenu =
  "SelectMenu" as unknown as ReaccordComponent<"SelectMenu">
export const Option = "Option" as unknown as ReaccordComponent<"Option">
export const TextInput =
  "TextInput" as unknown as ReaccordComponent<"TextInput">
export const Modal = "Modal" as unknown as ReaccordComponent<"Modal">

// Attachments
export const File = "File" as unknown as ReaccordComponent<"File">

export { ReaccordElements, ReaccordElement } from "./nodes/elements"
