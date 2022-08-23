import { CounterApp } from "./CounterApp"
import { testRender } from "reaccord/lib/test-utils"

describe("ActionRow", () => {
  it("should add an event listener", async () => {
    const { ref, client, clickButton, message, waitForUpdate } =
      await testRender(() => <CounterApp />)

    expect(ref.send.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [
            Object {
              "components": Array [
                Object {
                  "custom_id": "increment",
                  "disabled": false,
                  "emoji": undefined,
                  "label": "+",
                  "style": 1,
                  "type": 2,
                },
              ],
              "type": 1,
            },
          ],
          "content": "Count: 0",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    clickButton("increment")

    await waitForUpdate()

    expect(message.edit).toHaveBeenCalledTimes(1)
    expect(message.edit.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [
            Object {
              "components": Array [
                Object {
                  "custom_id": "increment",
                  "disabled": false,
                  "emoji": undefined,
                  "label": "+",
                  "style": 1,
                  "type": 2,
                },
              ],
              "type": 1,
            },
          ],
          "content": "Count: 1",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    client.destroy()
  })
})
