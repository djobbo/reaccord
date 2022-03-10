import { BaseNode } from "../_Base"
import { Client, Interaction, Modal } from "discord.js"
import { ModalNode, isModalNode } from "./Modal"

export class ModalRootNode extends BaseNode<"modal-root", BaseNode, ModalNode> {
    client: Client

    interactionListeners: Record<
        string,
        (interaction: Interaction) => unknown
    > = {}

    constructor(client: Client) {
        super("modal-root")
        this.client = client

        client.on("interactionCreate", (interaction) => {
            if (!interaction.isModalSubmit()) return
            const listener = this.interactionListeners[interaction.customId]
            listener?.(interaction)
        })
    }

    get rootNode() {
        return this
    }

    addInteractionListener(
        uuid: string,
        fn: (interaction: Interaction) => unknown
    ) {
        this.interactionListeners[uuid] = fn
    }

    removeInteractionListener(uuid: string) {
        delete this.interactionListeners[uuid]
    }

    render(): Modal {
        const modalNode = this.firstChild
        if (this.children.length !== 1 || !modalNode || !isModalNode(modalNode))
            throw new Error("modal should only have one child, a <modal> node")
        return modalNode.render()
    }
}

export const isModalRootNode = (node: BaseNode): node is ModalRootNode =>
    node instanceof ModalRootNode
