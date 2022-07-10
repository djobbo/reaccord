import { CharacterEmbed } from "./components/CharacterEmbed"
import { CharacterSelect } from "./components/CharacterSelect"
import { Navigation } from "./components/Navigation"
import { SearchCharacterRow } from "./components/SearchCharacterRow"
import { useCharacters } from "./hooks/useCharacters"
import { useState } from "react"
import type { Character } from "./types"

type AppProps = {
    search?: string
}

export const App = ({ search: defaultSearch }: AppProps) => {
    const [search, setSearch] = useState(defaultSearch ?? "")
    const [page, setPage] = useState(1)
    const [character, setCharacter] = useState<Character | undefined>(undefined)
    const { data: { characters, pageInfo } = {}, isLoading } = useCharacters(
        search,
        page,
        {
            onSuccess: (data) => setCharacter(data.characters[0]),
            onError: () => setCharacter(undefined),
        },
    )

    return (
        <>
            {isLoading ? (
                <embed>
                    <title>Loading</title>
                    <color color="ORANGE" />
                </embed>
            ) : (
                <CharacterEmbed character={character} />
            )}
            {characters && (
                <CharacterSelect
                    characters={characters}
                    character={character}
                    onSelectCharacter={(id) => {
                        setCharacter(
                            characters.find(
                                (char) => char.id.toString() === id,
                            ),
                        )
                    }}
                />
            )}
            <SearchCharacterRow
                search={search}
                setSearch={(val) => {
                    setSearch(val)
                    setPage(1)
                }}
                isLoading={isLoading}
            />
            <Navigation
                pageInfo={pageInfo}
                loading={isLoading}
                page={page}
                setPage={(page) => setPage(page)}
            />
        </>
    )
}
