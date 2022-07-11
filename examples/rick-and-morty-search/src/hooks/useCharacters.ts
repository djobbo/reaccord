import { useQuery } from "react-query/react"
import axios from "axios"
import type { Character, PageInfo } from "../types"

type APIResponse = {
    info: PageInfo
    results: Character[]
}

type Response = {
    characters: Character[]
    pageInfo: PageInfo
}

type Options = {
    onSuccess: (res: Response) => void
    onError: () => void
}

export const useCharacters = (
    name: string,
    page: number,
    { onSuccess, onError }: Options,
) => {
    const { data, ...query } = useQuery<Response>(
        ["character", { name, page }],
        async () => {
            const res = await axios.get<APIResponse>(
                `https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`,
            )

            return {
                characters: res.data.results,
                pageInfo: res.data.info,
            }
        },
        { onSuccess, onError },
    )

    return { data, ...query }
}
