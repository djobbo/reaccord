export { Client } from "./Client"
export {
    ChatInputCommand,
    MessageContextCommand,
    UserContextCommand,
} from "./Command"
export * from "./react"
export * from "discord.js"
export { renderMessage } from "./renderer"

export type ReaccordConfig = {
    /**
     * Entry point for the bot.
     */
    entry: string
}
