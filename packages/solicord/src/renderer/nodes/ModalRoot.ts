import { BaseNode } from "./_Base"
import {isModalNode, ModalNode} from './Modal'
import {Modal, Client} from 'discord.js'
import { RootNode } from './Root'

export class ModalRootNode extends BaseNode<"modal-root", BaseNode, ModalNode> {
    client: Client

    constructor(client: Client) {
        super("modal-root")
        this.client = client
    }

    get rootNode() {
        return this
    }

    render(): Modal {
        const modalNode = this.firstChild
        if (this.children.length !== 1 || !modalNode || !isModalNode(modalNode))
            throw new Error("modal should only have one child, a <modal> node")
        return modalNode.render()
    }
}

export const isModalRootNode = (node: BaseNode): node is ModalRootNode => node instanceof ModalRootNode;