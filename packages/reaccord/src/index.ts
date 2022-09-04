export { Client } from "./Client"
export {
  ChatInputCommand,
  MessageContextCommand,
  UserContextCommand,
} from "./Command"
export * from "./hooks"
export { renderMessage } from "./renderer"

export type ReaccordConfig = {
  /**
   * Entry point for the bot.
   */
  entry: string
}

export * from "./jsx"
