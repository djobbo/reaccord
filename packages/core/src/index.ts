import { JSX } from "../jsx-runtime"
import { RootNode } from "./nodes/Root"
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
import { ModalRootNode } from "./nodes/Interaction/ModalRoot"

type RenderFn = (code: () => JSX.Element, root: RootNode | ModalRootNode) => void

type Channel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel

const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms = 300) => {
    let timeoutId: NodeJS.Timeout
    return (...args: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), ms)
    }
}

const createModal = (render: RenderFn, client: Client, code: JSX.Element) => {

    const modal = new ModalRootNode(client)
    render(() => code, modal)

    return modal.render()
}

// If used directly inside button (<button onClick={openModal(Modal)}/>),
// will prevent the app from defering update, because opening a modal is
// already an interaction response.
const openModal =
    (render: RenderFn, client: Client) =>
    (modal: JSX.Element) =>
    (interaction: ButtonInteraction): true => {
        interaction.showModal(createModal(render, client, modal))
        return true
    }

const renderMessage = (render: RenderFn, client: Client) => (channel: Channel, message: () => JSX.Element) => {
    let msg: Message | undefined = undefined

    const cb = async (root: RootNode) => {
        const rendered = root.render()
        if (msg) await msg.edit(rendered as MessageEditOptions)
        else msg = await channel.send(rendered as MessageOptions)
    }

    const root = new RootNode(client, debounce(cb, 50))
    render(message, root)
}

export const reaccord = (render: RenderFn) => (client: Client) => {
    return {
        openModal: openModal(render, client),
        renderMessage: renderMessage(render, client),
    }
}

export * from './constants'
export * from './nodes'
export * from './helpers'