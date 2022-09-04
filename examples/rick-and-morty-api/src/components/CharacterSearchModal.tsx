import { Modal } from "reaccord"

type CharacterSearchModalProps = {
  search: string
  setSearch: (val: string) => void
}

export const CharacterSearchModal = ({
  search,
  setSearch,
}: CharacterSearchModalProps) => {
  return (
    <Modal customId="character-search-modal" title="Search character">
      <Modal.Input
        name="name"
        label="Enter character name..."
        value={search}
        onChange={(newName) => setSearch(newName)}
        required
      />
    </Modal>
  )
}
