export * from "./lib/index"
import type { FC } from "react"
import type { ReaccordElements } from "./lib"

// Reaccord Elements
// Elements are string under the hood, but exported as functions.
// TODO: add a script that checks if all elements are correctly exported
// Text
export const Br: FC<ReaccordElements["Br"]>
export const Code: FC<ReaccordElements["Code"]>
export const CodeBlock: FC<ReaccordElements["CodeBlock"]>
export const Span: FC<ReaccordElements["Span"]>
export const Link: FC<ReaccordElements["Link"]>

// Embed
export const Embed: FC<ReaccordElements["Embed"]>
export const Author: FC<ReaccordElements["Author"]>
export const Description: FC<ReaccordElements["Description"]>
export const Footer: FC<ReaccordElements["Footer"]>
/**
 * Can be used at the Root to send an image file or inside an Embed.
 */
export const Image: FC<ReaccordElements["Image"]>
export const Thumbnail: FC<ReaccordElements["Thumbnail"]>
export const Title: FC<ReaccordElements["Title"]>
export const Field: FC<ReaccordElements["Field"]>

// Interaction Components
export const ActionRow: FC<ReaccordElements["ActionRow"]>
export const ModalRow: FC<ReaccordElements["ModalRow"]>
export const Button: FC<ReaccordElements["Button"]>
export const LinkButton: FC<ReaccordElements["LinkButton"]>
export const SelectMenu: FC<ReaccordElements["SelectMenu"]>
export const Option: FC<ReaccordElements["Option"]>
export const TextInput: FC<ReaccordElements["TextInput"]>
export const Modal: FC<ReaccordElements["Modal"]>

// Attachments
export const File: FC<ReaccordElements["File"]>
