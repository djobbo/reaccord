import {
  ActionRowBuilder,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { Node } from "./Node"
import { assertIsDefined } from "../helpers/asserts"
import { assertIsNode } from "./helpers/assertIsNode"
import type { Interaction } from "discord.js"
import type { RootNode } from "./Root"

export class ModalNode extends Node<"Modal"> {
  constructor(rootNode: RootNode) {
    super("Modal", rootNode)
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
          customId: input.props.name,
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

          const customId = input.props.name
          const value = interaction.fields.getTextInputValue(customId)
          input.props.onChange?.(value, interaction)
          props.set(input.props.name, value)
        })
      })

      if (
        !(await this.props.onSubmit?.(Object.fromEntries(props), interaction))
      ) {
        await interaction.deferUpdate()
      }
    }

    root.addInteractionListener(customId, listener)

    return modal
  }
}
