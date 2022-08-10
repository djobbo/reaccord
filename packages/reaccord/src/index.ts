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

// Reaccord Elements
// TODO: add a script that checks if all elements are correctly exported
// Text
export const Br = "Br"
export const Code = "Code"
export const CodeBlock = "CodeBlock"
export const Span = "Span"
export const Link = "Link"

// Content
export const Content = "Content"

// Embed
export const Embed = "Embed"
export const Author = "Author"
export const Color = "Color"
export const Desc = "Desc"
export const Footer = "Footer"
export const Image = "Image"
export const Thumb = "Thumb"
export const Timestamp = "Timestamp"
export const Title = "Title"
export const Url = "Url"
export const Field = "Field"

// Interaction Components
export const ActionRow = "ActionRow"
export const ModalRow = "ModalRow"
export const Button = "Button"
export const Select = "Select"
export const Option = "Option"
export const Input = "Input"
export const Modal = "Modal"

// Attachments
export const File = "File"

export * from "./jsx"
