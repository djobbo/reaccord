import { CharacterEmbed } from "./CharacterEmbed"
import { NameModal } from "./NameModal"
import { Navigation } from "./Navigation"
import { fetchCharacters } from "./fetch"
import { useEffect, useState } from "react"
import { useModal } from "reaccord"
import type { APIResponse, Character } from "./types"

type AppProps = {
    search: string
}

export const App = ({ search }: AppProps) => {
    const [{ name, page }, setPageSearch] = useState({ name: search, page: 1 })
    const [data, setData] = useState<APIResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [character, setCharacter] = useState<Character | undefined>(undefined)
    const { openModal } = useModal()

    useEffect(() => {
        setLoading(true)
        fetchCharacters(name, page)
            .then((res) => {
                setData(res)
                setCharacter(res.results?.[0])
            })
            .catch(() => {
                setData(null)
                setCharacter(undefined)
            })
            .finally(() => setLoading(false))
    }, [name, page])

    return (
        <>
            {loading ? (
                <embed>
                    <title>Loading</title>
                    <color color="ORANGE" />
                </embed>
            ) : (
                <CharacterEmbed character={character} />
            )}
            {data && (
                <action-row>
                    <select
                        onChange={([val]) => {
                            setCharacter(
                                data.results.find(
                                    (char) => char.id.toString() === val,
                                ),
                            )
                        }}
                    >
                        {data.results.map((char, i) => (
                            <option
                                key={char.id}
                                label={char.name}
                                value={char.id.toString()}
                                description={`${char.species} - ${char.status}`}
                                default={
                                    character
                                        ? char.id === character.id
                                        : i === 0
                                }
                            />
                        ))}
                    </select>
                </action-row>
            )}
            <action-row>
                <button
                    style="PRIMARY"
                    onClick={openModal(
                        <NameModal
                            name={name}
                            setName={(val) => {
                                setPageSearch({ name: val, page: 1 })
                            }}
                        />,
                    )}
                    disabled={loading}
                >
                    Search Character 🔎
                </button>
                {name && (
                    <>
                        <button style="SECONDARY" disabled>
                            Current search: {name}
                        </button>
                        <button
                            style="SECONDARY"
                            onClick={() =>
                                setPageSearch(({ page }) => ({
                                    page,
                                    name: "",
                                }))
                            }
                            disabled={loading}
                        >
                            Clear search
                        </button>
                    </>
                )}
            </action-row>
            <Navigation
                data={data}
                loading={loading}
                page={page}
                setPage={(page) =>
                    setPageSearch(({ name }) => ({ name, page }))
                }
            />
        </>
    )
}
