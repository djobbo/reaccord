import { ActionRow, Button } from ".."
import { testRender } from "../test-utils"

describe("ActionRow", () => {
  it("should render", async () => {
    const { client, ref, message } = await testRender(() => <ActionRow />)

    expect(ref.send).toHaveBeenCalledTimes(1)
    expect(ref.send.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [
            Object {
              "components": Array [],
              "type": 1,
            },
          ],
          "content": "",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    expect(message.edit).not.toHaveBeenCalled()
    client.destroy()
  })
})

describe("ActionRow Button", () => {
  it("should not render outside of ActionRow", async () => {
    const { ref, client } = await testRender(() => <Button />)

    // expect(rootNode.firstChild).toBeUndefined()

    expect(ref.send).toHaveBeenCalledTimes(1)
    expect(ref.send.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [],
          "content": "​",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    client.destroy()
  })

  it("should render inside of ActionRow", async () => {
    const { ref, client } = await testRender(() => (
      <ActionRow>
        <Button id="my-awesome-uuid">Hello React</Button>
      </ActionRow>
    ))

    expect(ref.send.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [
            Object {
              "components": Array [
                Object {
                  "custom_id": "my-awesome-uuid",
                  "disabled": false,
                  "emoji": undefined,
                  "label": "Hello React",
                  "style": 2,
                  "type": 2,
                },
              ],
              "type": 1,
            },
          ],
          "content": "",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    client.destroy()
  })

  it("should add an event listener", async () => {
    const mockOnClick = jest.fn()

    const { ref, client, clickButton } = await testRender(() => (
      <ActionRow>
        <Button id="my-awesome-uuid" onClick={mockOnClick}>
          Hello React
        </Button>
      </ActionRow>
    ))

    expect(ref.send.mock.calls.at(-1)).toMatchInlineSnapshot(`
      Array [
        Object {
          "components": Array [
            Object {
              "components": Array [
                Object {
                  "custom_id": "my-awesome-uuid",
                  "disabled": false,
                  "emoji": undefined,
                  "label": "Hello React",
                  "style": 2,
                  "type": 2,
                },
              ],
              "type": 1,
            },
          ],
          "content": "",
          "embeds": Array [],
          "files": Array [],
        },
      ]
    `)

    clickButton("my-awesome-uuid")

    expect(mockOnClick).toHaveBeenCalled()

    client.destroy()
  })
})
