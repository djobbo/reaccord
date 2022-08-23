import { Client } from "../Client"
import { RootNode } from "../nodes/Root"
import { renderMessage } from "../renderer"
import type { Interaction, Message } from "discord.js"

export const createInteractionRef = (): MockMessage => {
  return new MockMessage()
}

class MockMessage {
  editCount = 0
  send = jest.fn(async (): Promise<unknown> => createInteractionRef())
  reply = jest.fn(async (): Promise<unknown> => createInteractionRef())
  edit = jest.fn(async (): Promise<unknown> => {
    this.editCount++
    return this
  })
  editable = true

  constructor() {
    console.log("MY MESSAGE")
  }
}

export const createRootContext = () => {
  const client = new Client({ intents: [], token: "bot-token" })
  const ref = createInteractionRef()
  const rootNode = new RootNode(client, ref as unknown as Message)
  rootNode.uuid = "root-uuid"

  return {
    client,
    ref,
    rootNode,
    clickButton: (customId: string) => {
      client.emit("interactionCreate", {
        isChatInputCommand: () => false,
        isMessageContextMenuCommand: () => false,
        isUserContextMenuCommand: () => false,
        isModalSubmit: () => false,
        isSelectMenu: () => false,
        isButton: () => true,
        customId,
        deferUpdate() {
          jest.fn()
        },
      } as Interaction)
    },
    waitForUpdate: async (): Promise<void> => {
      await rootNode.updateMessage()
    },
  }
}

export const testRender = async (code: () => JSX.Element) => {
  const rootContext = createRootContext()
  const message = (await renderMessage(
    rootContext.client,
    {},
    rootContext.rootNode,
  )(rootContext.ref as unknown as Message, code)) as unknown as MockMessage

  return { ...rootContext, message }
}
