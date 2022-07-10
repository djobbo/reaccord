export { Client } from "./Client"
export {
    ChatInputCommand,
    MessageContextCommand,
    UserContextCommand,
} from "./Command"
export * from "./react"
export * from "discord.js"
import React from "react"
export default React

export type ReaccordConfig = {
    /**
     * Entry point for the bot.
     */
    entry: string
}
