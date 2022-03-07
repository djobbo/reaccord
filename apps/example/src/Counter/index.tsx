import { createSignal } from "solid-js"

export const Counter = () => {
    const [count, setCount] = createSignal(0)

    return (
        <>
            <content>
                <span bold>reaccord/solid counter</span>
            </content>
            <action-row>
                <button
                    id="add"
                    style="Danger"
                    onClick={() => {
                        setCount((count) => count - 1)
                    }}
                >
                    -
                </button>
                <button style="Secondary" disabled>
                    {count()}
                </button>
                <button
                    id="sub"
                    style="Success"
                    onClick={() => {
                        setCount((count) => count + 1)
                    }}
                >
                    +
                </button>
            </action-row>
        </>
    )
}
