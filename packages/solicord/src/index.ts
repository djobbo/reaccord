import { JSX } from "../jsx-runtime"
import { RootNode } from "./renderer/nodes/Root"
import {
    Client,
    DMChannel,
    PartialDMChannel,
    NewsChannel,
    TextChannel,
    ThreadChannel,
    Message,
    MessageEditOptions,
    MessageOptions,
    ButtonInteraction
} from "discord.js"
import { render } from "./renderer"
import { ModalRootNode } from "./renderer/nodes/ModalRoot"

type Channel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel

const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms = 300) => {
    let timeoutId: NodeJS.Timeout
    return (...args: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), ms)
    }
}

const createModal = (client: Client, code: JSX.Element) => {

    const modal = new ModalRootNode(client)
    render(() => code, modal)

    return modal.render()
}

// If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.
const openModal =
    (client: Client) =>
    (modal: JSX.Element) =>
    (interaction: ButtonInteraction): true => {
        interaction.showModal(createModal(client, modal))
        return true
    }

const renderMessage = (client: Client) => (channel: Channel, message: () => JSX.Element) => {
    let msg: Message | undefined = undefined

    const cb = async (root: RootNode) => {
        const rendered = root.render()
        if (msg) await msg.edit(rendered as MessageEditOptions)
        else msg = await channel.send(rendered as MessageOptions)
    }

    const root = new RootNode(client, debounce(cb, 50))
    render(message, root)
}

export const solicord = (client: Client) => {
    return {
        openModal: openModal(client),
        renderMessage: renderMessage(client),
    }
}

export * from './renderer'
export * from './constants'