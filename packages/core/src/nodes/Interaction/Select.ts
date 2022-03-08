import { BaseNode } from "../_Base"
import { Interaction, SelectMenuComponent } from "discord.js"
import { ActionRowNode } from "./ActionRow"
import { isOptionNode, OptionNode } from "./Option"

export class SelectNode extends BaseNode<"select", ActionRowNode, OptionNode> {
    constructor() {
        super("select")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    render(): SelectMenuComponent {
        const root = this.rootNode
        if (!root) throw new Error("Root element not found for dropdown")

        const customId = this.customId
        const select = new SelectMenuComponent()
            .setCustomId(customId)
            .setDisabled(this.attr.disabled ?? false)
            .setOptions(...this.children.filter(isOptionNode).map((child) => child.render()))

        const listener = (interaction: Interaction) => {
            if (!interaction.isSelectMenu()) return
            if (interaction.customId !== customId) return

            if (!this.attr.onChange?.(interaction.values, interaction)) interaction.deferUpdate()
        }

        root.addInteractionListener(customId, listener)
        return select
    }
}

export const isSelectNode = (node: BaseNode): node is SelectNode => node instanceof SelectNode
