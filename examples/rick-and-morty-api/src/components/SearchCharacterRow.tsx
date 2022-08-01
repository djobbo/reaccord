import { ButtonStyle, useModal } from "reaccord"
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

	const openCharacterSearchModal = openModal(
		<CharacterSearchModal search={search} setSearch={setSearch} />,
	)

	return (
		<action-row>
			<button
				style={ButtonStyle.Primary}
				onClick={openCharacterSearchModal}
				disabled={isLoading}
			>
				Search Character 🔎
			</button>
			{search && (
				<>
					<button style={ButtonStyle.Secondary} disabled>
						Current search: {search}
					</button>
					<button
						style={ButtonStyle.Secondary}
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
