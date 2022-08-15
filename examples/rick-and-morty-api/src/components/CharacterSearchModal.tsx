import { Modal, ModalRow, TextInput } from "reaccord"

type CharacterSearchModalProps = {
  search: string
  setSearch: (val: string) => void
}

export const CharacterSearchModal = ({
  search,
  setSearch,
}: CharacterSearchModalProps) => {
  return (
    <Modal title="Search character">
      <ModalRow>
        <TextInput
          name="name"
          label="Enter character name..."
          value={search}
          onChange={(newName) => setSearch(newName)}
          required
        />
      </ModalRow>
    </Modal>
  )
}
