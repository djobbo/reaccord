import { ActionRow, useModal } from "reaccord"
import { ButtonStyle } from "discord.js"
import { CharacterSearchModal } from "./CharacterSearchModal"

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

  const openCharacterSearchModal = openModal(() => (
    <CharacterSearchModal search={search} setSearch={setSearch} />
  ))

  return (
    <ActionRow>
      <ActionRow.Button
        style={ButtonStyle.Primary}
        onClick={openCharacterSearchModal}
        disabled={isLoading}
      >
        Search Character 🔎
      </ActionRow.Button>
      {search && (
        <>
          <ActionRow.Button style={ButtonStyle.Secondary} disabled>
            Current search: {search}
          </ActionRow.Button>
          <ActionRow.Button
            style={ButtonStyle.Secondary}
            onClick={() => setSearch("")}
            disabled={isLoading}
          >
            Clear search
          </ActionRow.Button>
        </>
      )}
    </ActionRow>
  )
}
