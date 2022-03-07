import axios from 'axios'

const RAM_API_BASE = "https://rickandmortyapi.com/api"

export const fetchCharacters = async (name: string, page: number = 1) => {
    const res = await axios.get<APIResponse>(`${RAM_API_BASE}/character/?page=${page}&name=${name}`)
    return res.data
}
