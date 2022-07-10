type CharacterSearchModalProps = {
    search: string
    setSearch: (val: string) => void
}

export const CharacterSearchModal = ({
    search,
    setSearch,
}: CharacterSearchModalProps) => {
    return (
        <modal title="Search character">
            <modal-row>
                <input
                    id="name"
                    label="Enter character name..."
                    value={search}
                    onChange={(newName) => setSearch(newName)}
                    required
                />
            </modal-row>
        </modal>
    )
}
