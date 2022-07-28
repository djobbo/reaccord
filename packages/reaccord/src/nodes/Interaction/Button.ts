import { ButtonBuilder, ButtonStyle } from "discord.js"
import { TextContainerNode } from "../_TextContainer"
import type { ActionRowNode } from "./ActionRow"
import type { Interaction } from "discord.js"

export class ButtonNode extends TextContainerNode<"button", ActionRowNode> {
    constructor() {
        super("button")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    render(): ButtonBuilder {
        const root = this.rootNode
        if (!root) throw new Error("Root element not found for button")

        const { customId } = this
        const button = new ButtonBuilder()
            .setCustomId(customId)
            .setDisabled(this.attr.disabled ?? false)
            .setLabel(this.innerText)
            .setStyle(this.attr.style ?? ButtonStyle.Secondary)

        const listener = async (interaction: Interaction) => {
            if (!interaction.isButton()) return
            if (interaction.customId !== customId) return

            if (!(await this.attr.onClick?.(interaction)))
                await interaction.deferUpdate()
        }

        root.addInteractionListener(customId, listener)
        return button
    }
}
