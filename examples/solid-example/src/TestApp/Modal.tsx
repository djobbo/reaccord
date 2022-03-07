import { createSignal } from "solid-js"

export const MyModal = ({ myAwesomeFn }: { myAwesomeFn: (value: string) => void }) => {
    const [text, setText] = createSignal("")

    return (
        <modal title="My Modal" onSubmit={() => console.log("submit xd")}>
            <modal-row>
                <input onChange={myAwesomeFn} label="BRUH" />
            </modal-row>
            <modal-row>
                <input
                    onChange={(newText) => setText(newText)}
                    value={text()}
                    label={text() || "Enter text lol"}
                    large
                />
            </modal-row>
        </modal>
    )
}
