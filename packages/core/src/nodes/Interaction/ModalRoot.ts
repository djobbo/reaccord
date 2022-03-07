import { BaseNode } from "../_Base"
import { isModalNode, ModalNode } from "./Modal"
import { Modal, Client, Interaction } from "discord.js"

export class ModalRootNode extends BaseNode<"modal-root", BaseNode, ModalNode> {
    client: Client
    listeners: Record<string, (interaction: Interaction) => unknown> = {}

    constructor(client: Client) {
        super("modal-root")
        this.client = client

        client.on("interactionCreate", (interaction) => {
            if (!interaction.isModalSubmit()) return
            const listener = this.listeners[interaction.customId]
            listener?.(interaction)
        })
    }

    get rootNode() {
        return this
    }

    addListener(uuid: string, fn: (interaction: Interaction) => unknown) {
        this.listeners[uuid] = fn
    }

    removeListener(uuid: string) {
        delete this.listeners[uuid]
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
