import { CharacterSearchModal } from "./CharacterSearchModal"
import { useModal } from "reaccord"

type SearchCharacterRowProps = {
    search: string
    setSearch: (val: string) => void
    isLoading: boolean
}

export const SearchCharacterRow = ({
    search,
    setSearch,
    isLoading,
}: SearchCharacterRowProps) => {
    const { openModal } = useModal()

    const openCharacterSearchModal = openModal(
        <CharacterSearchModal search={search} setSearch={setSearch} />,
    )

    return (
        <action-row>
            <button
                style="PRIMARY"
                onClick={openCharacterSearchModal}
                disabled={isLoading}
            >
                Search Character 🔎
            </button>
            {search && (
                <>
                    <button style="SECONDARY" disabled>
                        Current search: {search}
                    </button>
                    <button
                        style="SECONDARY"
                        onClick={() => setSearch("")}
                        disabled={isLoading}
                    >
                        Clear search
                    </button>
                </>
            )}
        </action-row>
    )
}
