import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "discord.js"
import { BaseNode, assertIsNode } from "./_Base"
import { assertIsDefined } from "../helpers/asserts"
import type {
  ButtonInteraction,
  Interaction,
  MessageActionRowComponentBuilder,
  SelectMenuInteraction,
} from "discord.js"
import type { ReactNode } from "react"

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

export class ActionRowNode extends BaseNode<"ActionRow"> {
  constructor() {
    super("ActionRow")
  }

  render(): ActionRowBuilder<MessageActionRowComponentBuilder> {
    const root = this.rootNode
    if (!root) throw new Error("Root element not found for Button")

    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()

    this.children.forEach((child) => {
      switch (child.type) {
        case "Button": {
          assertIsNode(child, "Button")

          const customId = child.customId
          const button = new ButtonBuilder({
            customId,
            disabled: child.props.disabled ?? false,
            style: child.props.style ?? ButtonStyle.Secondary,
            label: child.innerText,
          })

          const listener = async (interaction: Interaction) => {
            assertIsNode(child, "Button")

            if (!interaction.isButton()) return
            if (interaction.customId !== customId) return

            if (!(await child.props.onClick?.(interaction)))
              await interaction.deferUpdate()
          }

          root.addInteractionListener(customId, listener)
          actionRow.addComponents(button)
          return
        }

        case "LinkButton":
          assertIsNode(child, "LinkButton")
          assertIsDefined(child.props.url, "LinkButton URL is required")

          const linkButton = new ButtonBuilder({
            disabled: child.props.disabled ?? false,
            label: child.innerText,
            style: ButtonStyle.Link,
            url: child.props.url,
          })

          actionRow.addComponents(linkButton)
          return

        case "SelectMenu": {
          assertIsNode(child, "SelectMenu")
          const customId = child.customId
          const selectMenu = new SelectMenuBuilder({
            customId,
            disabled: child.props.disabled ?? false,
            placeholder: child.props.placeholder,
          })

          const options = child.children.map((option) => {
            assertIsNode(option, "Option")
            assertIsDefined(option.props.value, "Option value is required")
            assertIsDefined(option.innerText, "Option label is required")

            return new SelectMenuOptionBuilder({
              default: option.props.default ?? false,
              label: option.innerText,
              value: option.props.value,
              description: option.props.description,
            })
          })

          selectMenu.addOptions(options)

          const listener = async (interaction: Interaction) => {
            assertIsNode(this, "SelectMenu")

            if (!interaction.isSelectMenu()) return
            if (interaction.customId !== customId) return

            if (
              !(await child.props.onChange?.(interaction.values, interaction))
            )
              interaction.deferUpdate()
          }

          root.addInteractionListener(customId, listener)
          actionRow.addComponents(selectMenu)
          return
        }

        default:
          throw new Error(
            `Unexpected element type: ${child.type} inside ActionRow`,
          )
      }
    })
    return actionRow
  }
}

export const isActionRowNode = (node: BaseNode): node is ActionRowNode =>
  node.type === "ActionRow"
