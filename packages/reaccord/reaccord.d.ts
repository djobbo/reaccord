export * from "./lib/index"
import type { FC } from "react"
import type { ReaccordElement } from "./lib"

// Reaccord Elements
// Elements are string under the hood, but exported as functions.
// TODO: add a script that checks if all elements are correctly exported
// Text
export const Br: FC<ReaccordElement["Br"]>
export const Code: FC<ReaccordElement["Code"]>
export const CodeBlock: FC<ReaccordElement["CodeBlock"]>
export const Span: FC<ReaccordElement["Span"]>
export const Link: FC<ReaccordElement["Link"]>

// Content
export const Content: FC<ReaccordElement["Content"]>

// Embed
export const Embed: FC<ReaccordElement["Embed"]>
export const Author: FC<ReaccordElement["Author"]>
export const Color: FC<ReaccordElement["Color"]>
export const Desc: FC<ReaccordElement["Desc"]>
export const Footer: FC<ReaccordElement["Footer"]>
export const Image: FC<ReaccordElement["Image"]>
export const Thumb: FC<ReaccordElement["Thumb"]>
export const Timestamp: FC<ReaccordElement["Timestamp"]>
export const Title: FC<ReaccordElement["Title"]>
export const Url: FC<ReaccordElement["Url"]>
export const Field: FC<ReaccordElement["Field"]>

// Interaction Components
export const ActionRow: FC<ReaccordElement["ActionRow"]>
export const ModalRow: FC<ReaccordElement["ModalRow"]>
export const Button: FC<ReaccordElement["Button"]>
export const Select: FC<ReaccordElement["Select"]>
export const Option: FC<ReaccordElement["Option"]>
export const Input: FC<ReaccordElement["Input"]>
export const Modal: FC<ReaccordElement["Modal"]>
