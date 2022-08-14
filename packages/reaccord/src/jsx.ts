import type { Attachment, AttachmentBuilder } from "discord.js"
import type { Buffer } from "node:buffer"
import type { ReactNode } from "react"
import type { Stream } from "node:stream"

type _BaseAttributes = {
  key?: number | string | null
}

export type FileAttachment =
  | Buffer
  | Stream
  | string
  | AttachmentBuilder
  | Attachment

type TextElement = {
  // TODO: update these
  Br: {} & _BaseAttributes
  Code: {
    children?: ReactNode
  } & _BaseAttributes
  CodeBlock: {
    lang: string //TODO: add some lang suggestions
    children?: ReactNode
    multiline?: boolean
  } & _BaseAttributes
  Span: {
    italic?: boolean
    bold?: boolean
    children?: ReactNode
  } & _BaseAttributes
  Link: {
    href: string
    children?: ReactNode
  } & _BaseAttributes
}

// TODO: add a script that checks if all elements are correctly exported
export type ReaccordElement = TextElement & {
  // Content
  Content: {
    children?: ReactNode
  } & _BaseAttributes

  // Attachments
  File: { file: FileAttachment } & _BaseAttributes
}
