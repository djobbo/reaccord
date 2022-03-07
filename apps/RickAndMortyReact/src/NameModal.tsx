export const NameModal = ({
    name,
    setName,
}: {
    name: string
    setName: (val: string) => void
}) => {
    return (
        <modal title="Enter character name">
            <modal-row>
                <input
                    id="name"
                    label="Current search"
                    value={name}
                    onChange={(newName) => setName(newName)}
                    required
                />
            </modal-row>
        </modal>
    )
}
