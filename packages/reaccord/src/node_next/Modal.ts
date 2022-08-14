import {
  ActionRowBuilder,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { BaseNode, assertIsNode } from "./_Base"
import { assertIsDefined } from "../helpers/asserts"
import type { Interaction, ModalSubmitInteraction } from "discord.js"
import type { ReactNode } from "react"

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

export class ModalNode extends BaseNode<"Modal"> {
  constructor() {
    super("Modal")
  }

  render(): ModalBuilder {
    const root = this.rootNode
    if (!root) throw new Error("Root element not found for modal")
    assertIsDefined(this.props.title, "Modal title is required")

    const customId = this.customId
    const modal = new ModalBuilder({
      customId,
      title: this.props.title,
    })

    const actionRows = this.children.map((row) => {
      assertIsNode(row, "ModalRow")
      const actionRow = new ActionRowBuilder<TextInputBuilder>()

      const textInputs = row.children.map((input) => {
        assertIsNode(input, "TextInput")
        assertIsDefined(input.props.name, "TextInput name is required")
        assertIsDefined(input.props.label, "TextInput label is required")

        return new TextInputBuilder({
          customId: input.props.name + input.uuid,
          label: input.props.label,
          value: input.props.value,
          placeholder: input.props.placeholder,
          required: input.props.required,
          style: input.props.paragraph
            ? TextInputStyle.Paragraph
            : TextInputStyle.Short,
        })
      })

      return actionRow.addComponents(textInputs)
    })

    modal.addComponents(actionRows)

    const listener = async (interaction: Interaction) => {
      if (interaction.type !== InteractionType.ModalSubmit) return
      if (interaction.customId !== customId) return

      let props = new Map<string, string>()

      this.children.map((row) => {
        assertIsNode(row, "ModalRow")

        row.children.map((input) => {
          assertIsNode(input, "TextInput")
          assertIsDefined(input.props.name, "TextInput name is required")

          const customId = input.props.name + input.uuid
          const value = interaction.fields.getTextInputValue(customId)
          input.props.onChange?.(value, interaction)
          props.set(input.props.name, value)
        })
      })

      if (
        !(await this.props.onSubmit?.(Object.fromEntries(props), interaction))
      ) {
        await interaction.deferReply()
      }
    }

    root.addInteractionListener(customId, listener)

    return modal
  }
}

export const isModalNode = (node: BaseNode): node is ModalNode =>
  node.type === "Modal"
