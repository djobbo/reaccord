import { BaseInteraction, Message } from "discord.js"
import { MessageProvider } from "../react/MessageContext"
import { Node } from "./Node"
import { debounce } from "../helpers/debounce"
import { renderMessageContent } from "../renderer/renderMessageContent"
import type {
  AutocompleteInteraction,
  Interaction,
  TextBasedChannel,
} from "discord.js"
import type { Client, MessageRenderOptions } from "../Client"
import type { FiberRoot, Reconciler } from "react-reconciler"
import type { TextNode } from "./Text"

export type InteractionRefType =
  | TextBasedChannel
  | Message
  | Exclude<Interaction, AutocompleteInteraction>

const MESSAGE_UPDATE_DEBOUNCE_MS = 50

export class RootNode extends Node {
  reconcilerInstance: Reconciler<Node, Node, TextNode, unknown, unknown>
  #rootContainer: FiberRoot
  discordClient: Client
  terminateInteraction: () => void = () => void 0
  ref: InteractionRefType | null = null
  message: Message | null = null
  hydrationHooks: ((message: Message) => void)[] = []
  #globalInteractionListener: (interaction: Interaction) => void = () => {} // TODO: [NEXT] remove?
  #interactionListeners: Map<
    string,
    (interaction: Interaction) => unknown
  > | null = null
  modalInteractionListener: ((interaction: Interaction) => unknown) | null =
    null

  unmounted = false
  //TODO: [NEXT] move this
  messageRenderOptions: MessageRenderOptions = {}

  lastMessageUpdatePromise: Promise<Message> | null = null

  constructor(
    discordClient: Client,
    reconcilerInstance: Reconciler<Node, Node, TextNode, unknown, unknown>,
  ) {
    super("reaccord:__root")
    this.discordClient = discordClient
    this.setupGlobalInteractionListener()

    this.reconcilerInstance = reconcilerInstance
    this.#rootContainer = this.reconcilerInstance.createContainer(
      this,
      0,
      null,
      false,
      null,
      "",
      () => void 0,
      null,
    )
  }

  unmount() {
    this.unmounted = true
    this.#interactionListeners?.clear()
    this.discordClient.off("interactionCreate", this.#globalInteractionListener)
    this.reconcilerInstance.updateContainer(null, this.#rootContainer, null)
  }

  setupGlobalInteractionListener() {
    this.#globalInteractionListener = (interaction: Interaction) => {
      if (this.unmounted || !this.message) return

      if (!("customId" in interaction)) return

      const listener = this.#interactionListeners?.get(interaction.customId)
      listener?.(interaction)

      this.modalInteractionListener?.(interaction)
    }
    this.discordClient.on("interactionCreate", this.#globalInteractionListener)
  }

  addHydrationHook(fn: (message: Message) => void) {
    this.hydrationHooks.push(fn)

    return () => {
      this.hydrationHooks = this.hydrationHooks.filter((hook) => hook !== fn)
    }
  }

  replyToInteraction(
    ref: InteractionRefType,
    Code: () => JSX.Element,
    messageRenderOptions?: MessageRenderOptions,
  ) {
    if (!this.discordClient)
      throw new Error("Can't reply to interaction, Discord client is not set")

    this.ref = ref

    const mergedMessageRenderOptions = {
      ...(this.discordClient.messageRenderOptions ?? {}),
      ...messageRenderOptions,
    }

    let timeout: NodeJS.Timeout | undefined

    this.terminateInteraction = () => {
      if (timeout) clearTimeout(timeout)
      this.unmount()
    }

    if (!!mergedMessageRenderOptions.unmountAfter) {
      timeout = setTimeout(() => {
        this.terminateInteraction()
      }, mergedMessageRenderOptions.unmountAfter * 1000)
    }

    this.reconcilerInstance.updateContainer(
      <MessageProvider rootNode={this}>
        <Code />
      </MessageProvider>,
      this.#rootContainer,
      null,
    )

    this.render()
  }

  render = debounce(async () => {
    if (this.unmounted) return

    if (!this.ref) throw new Error("No ref")

    const { messageContent, interactionListeners } = renderMessageContent(this)
    this.#interactionListeners = interactionListeners

    if (!!this.message) {
      await this.message.edit(messageContent)
      return this.message
    }

    let reply: Message
    if (this.ref instanceof Message) {
      reply = await this.ref.reply(messageContent)
    } else if (this.ref instanceof BaseInteraction) {
      reply = await this.ref.reply({ ...messageContent, fetchReply: true })
    } else {
      reply = await this.ref.send(messageContent)
    }
    this.message = reply
    return reply
  }, MESSAGE_UPDATE_DEBOUNCE_MS)
}
