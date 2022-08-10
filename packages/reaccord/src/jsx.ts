import type {
  Attachment,
  AttachmentBuilder,
  ButtonInteraction,
  ButtonStyle,
  ColorResolvable,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js"
import type { Buffer } from "node:buffer"
import type { ReactNode } from "react"
import type { Stream } from "node:stream"

type BaseAttributes = {
  key?: number | string | null
}

export type FileAttachment =
  | Buffer
  | Stream
  | string
  | AttachmentBuilder
  | Attachment

// TODO: add a script that checks if all elements are correctly exported
export type ReaccordElement = {
  // Text
  Br: {} & BaseAttributes
  Code: {
    children?: ReactNode
  } & BaseAttributes
  CodeBlock: {
    lang: string
    children?: ReactNode
    multiline?: boolean
  } & BaseAttributes
  Span: {
    italic?: boolean
    bold?: boolean
    children?: ReactNode
  } & BaseAttributes
  Link: {
    href: string
    children?: ReactNode
  } & BaseAttributes

  // Content
  Content: {
    children?: ReactNode
  } & BaseAttributes

  // Embed
  Embed: {
    children?: ReactNode
  } & BaseAttributes
  Author: {
    name: ReactNode
    url?: string
    iconURL?: string
  } & BaseAttributes
  Color: {
    color: ColorResolvable
  } & BaseAttributes
  Desc: {
    children?: ReactNode
  } & BaseAttributes
  Footer: {
    children?: ReactNode
    iconURL?: string
  } & BaseAttributes
  Image: ({ src: string } | { file: FileAttachment }) & BaseAttributes
  Thumb: ({ src: string } | { file: FileAttachment }) & BaseAttributes
  Timestamp: {
    timestamp?: Date | number | null
  } & BaseAttributes
  Title: {
    children?: ReactNode
  } & BaseAttributes
  Url: {
    href: string
  } & BaseAttributes
  Field: {
    title: string
    children?: ReactNode
    inline?: boolean
  } & BaseAttributes

  // Interaction Components
  ActionRow: {
    children?: ReactNode
  } & BaseAttributes
  ModalRow: {
    children?: ReactNode
  } & BaseAttributes
  Button: {
    id?: string
    /**
     * By default, onClick will trigger a defered update, to prevent this, return a truthy value
     */
    onClick?: (interaction: ButtonInteraction) => any | Promise<any>
    children?: ReactNode
    disabled?: boolean
    style?: ButtonStyle
  } & BaseAttributes
  Select: {
    id?: string
    /**
     * By default, onChange will trigger a defered update, to prevent this, return a truthy value
     */
    onChange?: (
      values: string[],
      interaction: SelectMenuInteraction,
    ) => any | Promise<any>
    children?: ReactNode
    disabled?: boolean
    placeholder?: string
  } & BaseAttributes
  Option: {
    default?: boolean
    description?: string
    label?: string
    value?: string
  } & BaseAttributes
  Input: {
    id?: string
    onChange?: (
      value: string,
      interaction: ModalSubmitInteraction,
    ) => any | Promise<any>
    label?: string
    value?: string
    placeholder?: string
    required?: boolean
    large?: boolean
  } & BaseAttributes
  Modal: {
    id?: string
    children?: ReactNode
    title: string
    /**
     * By default, onSubmit will trigger a message and then delete it
     * in order to respond to the interaction.
     * To prevent this, return a truthy value
     */
    onSubmit?: (interaction: ModalSubmitInteraction) => any | Promise<any>
  } & BaseAttributes

  // Attachments
  File: { file: FileAttachment } & BaseAttributes
}
