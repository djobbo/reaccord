import { useCharacters } from "./useCharacters"
import { useState } from "react"
import type { Character } from "../types"

export const useCharacterSearch = (defaultSearch?: string) => {
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

    const selectCharacter = (id: string) => {
        setCharacter(characters?.find((char) => char.id.toString() === id))
    }

    return {
        search,
        setSearch,
        page,
        setPage,
        characters,
        pageInfo,
        isLoading,
        character,
        selectCharacter,
    }
}
