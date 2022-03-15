import { render, renderMessage } from "./renderer"
import type { Client } from "discord.js"

export const createRenderer = (client: Client) => ({
    renderMessage: renderMessage(render, client),
})

export * from "./react"
export { render } from "./renderer"
