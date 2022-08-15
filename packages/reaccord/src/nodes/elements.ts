// Embed Elements

import type {
  Attachment,
  AttachmentBuilder,
  ButtonInteraction,
  ButtonStyle,
  ColorResolvable,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js"
import type { ReactNode } from "react"
import type { Stream } from "node:stream"

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

// ActionRow Elements

type _ButtonBase = {
  /**
   * Label for the button, max 80 characters
   */
  children?: ReactNode
  style?: ButtonStyle
  emoji?: never
  disabled?: boolean
}

export type ActionRowElements = {
  // Interaction Components
  ActionRow: {
    children?: ReactNode
  }
  Button: _ButtonBase & {
    id?: string
    /**
     * By default, onClick will trigger a defered update, to prevent this, return a truthy value
     */
    onClick?: (interaction: ButtonInteraction) => any | Promise<any>
    style?: Exclude<ButtonStyle, ButtonStyle.Link>
  }
  LinkButton: _ButtonBase & {
    url: string
  }
  SelectMenu: {
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
  }
  Option: {
    default?: boolean
    description?: string
    children?: ReactNode
    value?: string
  }
}

// Modal Elements

export type ModalElements<
  FieldName extends string = string,
  Props extends Record<FieldName, string> = Record<FieldName, string>,
> = {
  Modal: {
    id?: string
    children?: ReactNode
    title: string
    /**
     * By default, onSubmit will trigger a message and then delete it
     * in order to respond to the interaction.
     * To prevent this, return a truthy value
     */
    onSubmit?: (
      props: Partial<Props>,
      interaction: ModalSubmitInteraction,
    ) => any | Promise<any>
  }
  ModalRow: {
    children?: ReactNode
  }
  TextInput: {
    /**
     * Input name should be unique per modal
     */
    name: FieldName
    onChange?: (
      value: string,
      interaction: ModalSubmitInteraction,
    ) => any | Promise<any>
    label?: string
    value?: string
    placeholder?: string
    required?: boolean
    paragraph?: boolean
  }
}

//FileAttachment Elements

export type FileAttachment =
  | Buffer
  | Stream
  | string
  | AttachmentBuilder
  | Attachment

type _FileAttachmentBase = { file: FileAttachment } | { src: string }

export type FileAttachmentElements = {
  File: _FileAttachmentBase
  Image: _FileAttachmentBase
  Thumbnail: _FileAttachmentBase
}

// Text Elements

export type TextElements = {
  // TODO: update these
  Br: {}
  Code: {
    children?: ReactNode
  }
  CodeBlock: {
    lang: string //TODO: add some lang suggestions
    children?: ReactNode
    multiline?: boolean
  }
  Span: {
    italic?: boolean
    bold?: boolean
    children?: ReactNode
  }
  Link: {
    href: string
    children?: ReactNode
  }
}

export type ReaccordElements = EmbedElements &
  ActionRowElements &
  ModalElements &
  FileAttachmentElements &
  TextElements

export type ReaccordElement = keyof ReaccordElements

export type NodeElements = ReaccordElements & {
  Text: {}
  Root: {}
  ModalRoot: {}
}

export type NodeElement = keyof NodeElements
