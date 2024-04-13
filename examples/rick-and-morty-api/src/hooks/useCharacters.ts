import { useQuery } from "@tanstack/react-query"
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
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`,
      )
      const data = (await response.json()) as APIResponse

      return {
        characters: data.results,
        pageInfo: data.info,
      }
    },
    { onSuccess, onError },
  )

  return { data, ...query }
}
