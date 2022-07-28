import { BaseNode } from "../_Base"
import { EMPTY_STRING } from "../../helpers/constants"
import { InteractionType, ModalBuilder } from "discord.js"
import { isInputNode, isModalRowNode } from "../guards"
import type { Interaction } from "discord.js"
import type { ModalRootNode } from "./ModalRoot"
import type { ModalRowNode } from "./ModalRow"

export class ModalNode extends BaseNode<"modal", ModalRootNode, ModalRowNode> {
    constructor() {
        super("modal")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    render(): ModalBuilder {
        const root = this.rootNode
        if (!root) throw new Error("Root element not found for modal")

        const { customId } = this
        const modal = new ModalBuilder()
            .setCustomId(customId)
            .setTitle(this.attr.title ?? EMPTY_STRING)
            .setComponents(
                ...this.children
                    .filter(isModalRowNode)
                    .map((child) => child.render()),
            )

        const listener = async (interaction: Interaction) => {
            if (interaction.type !== InteractionType.ModalSubmit) return
            if (interaction.customId !== customId) return

            if (!(await this.attr.onSubmit?.(interaction))) {
                await interaction.reply({ content: "done ✅" })
                await interaction.deleteReply()
            }

            this.children.filter(isModalRowNode).forEach((row) =>
                row.children.filter(isInputNode).forEach((input) => {
                    const customId = input.attr.id
                        ? `${input.attr.id}-${input.uuid}`
                        : input.uuid
                    input.attr.onChange?.(
                        interaction.fields.getTextInputValue(customId),
                        interaction,
                    )
                }),
            )
        }

        root.addInteractionListener(customId, listener)

        return modal
    }
}
