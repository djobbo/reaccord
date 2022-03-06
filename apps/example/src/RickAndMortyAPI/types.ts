
type PageInfo = {
    count: number
    pages: number
    next: string | null
    prev: string | null
}

type CharacterStatus = "Alive" | "Dead" | "unknown"

type Character = {
    id: number
    name: string
    status: CharacterStatus
    species: string
    type: string
    gender: string
    origin: {
        name: string
    }
    location: {
        name: string
    }
    image: string
}

type APIResponse = {
    info: PageInfo
    results: Character[]
}