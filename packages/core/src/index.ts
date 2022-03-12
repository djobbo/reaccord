import { render, renderMessage } from "./renderer"
import type { Client } from "discord.js"

export const reaccord = (client: Client) => ({
    renderMessage: renderMessage(render, client),
})

export * from "./react"
export { render } from "./renderer"
