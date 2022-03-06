import { BaseNode } from "./_Base"
import { ButtonComponent, Interaction, ButtonStyle } from "discord.js"
import { ActionRowNode } from "./ActionRow"
import { TextContainerNode } from "./_TextContainer"

export class ButtonNode extends TextContainerNode<"button", ActionRowNode> {
    disposer?: () => void

    constructor() {
        super("button")
    }

    get customId() {
        return this.attr.id ? `${this.attr.id}-${this.uuid}` : this.uuid
    }

    dispose(): void {
        this.disposer?.()
    }

    render(): ButtonComponent {
        this.dispose()

        if (!this.rootNode) throw new Error("Root element not found for button")
        const client = this.rootNode.client

        const customId = this.customId
        const button = new ButtonComponent()
            .setCustomId(customId)
            .setDisabled(this.attr.disabled ?? false)
            .setStyle(ButtonStyle[this.attr.style ?? "Primary"])
            .setLabel(this.innerText)

        const listener = (interaction: Interaction) => {
            if (!interaction.isButton()) return
            if (interaction.customId !== customId) return

            if (!this.attr.onClick?.(interaction)) interaction.deferUpdate()
        }

        client.on("interactionCreate", listener)

        this.disposer = () => {
            client.removeListener("interactionCreate", listener)
        }
        return button
    }
}

export const isButtonNode = (node: BaseNode): node is ButtonNode => node instanceof ButtonNode
