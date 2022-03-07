import { createSignal } from "solid-js"
import { openModal } from "../setupApp"
import { MyModal } from "./Modal"

export const TestApp = ({ username }: { username: string }) => {
    const [count, setCount] = createSignal(0)
    const [name, setName] = createSignal(username)
    const [isEnabled, setEnabled] = createSignal(false)

    setTimeout(() => {
        setEnabled(true)
    }, 2000)

    return (
        <>
            <embed>
                <title>Hi {name()}</title>
                <color color={isEnabled() ? "Green" : "Red"} />
                <field title="Field">
                    Field
                    <a href="https://google.com">Google</a>
                </field>
            </embed>
            <content>
                Hello
                <codeblock lang="js">console.log('{count()}')</codeblock>
                <code>xd</code>
                <span bold>Bold</span>
                <span italic>Italic</span>
                <br />
                <span bold italic>
                    BoldItalic
                </span>
            </content>
            <action-row>
                <button
                    id="add"
                    style="Danger"
                    onClick={() => {
                        setCount((count) => count - 1)
                    }}
                    disabled={!isEnabled()}
                >
                    -
                </button>
                <button style="Secondary" disabled>
                    {count()}
                </button>
                <button
                    id="substract"
                    style="Success"
                    onClick={() => {
                        setCount((count) => count + 1)
                    }}
                    disabled={!isEnabled()}
                >
                    +
                </button>
            </action-row>
            <action-row>
                <button
                    id="add"
                    style="Secondary"
                    onClick={openModal(<MyModal myAwesomeFn={(newName) => setName(newName)} />)}
                >
                    Open Modal
                </button>
            </action-row>
        </>
    )
}
