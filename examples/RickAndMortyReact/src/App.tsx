import { CharacterEmbed } from "./CharacterEmbed"
import { NameModal } from "./NameModal"
import { Navigation } from "./Navigation"
import { fetchCharacters } from "./fetch"
import { useEffect, useState } from "react"
import { useModal } from "@reaccord/core"
import type { APIResponse, Character } from "./types"

export const App = () => {
    const [name, setName] = useState("")
    const [page, setPage] = useState(1)
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
        <message>
            {loading ? (
                <embed>
                    <title>Loading</title>
                    <color color="Orange" />
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
                                    (char) => char.id.toString() === val
                                )
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
                    style="Primary"
                    onClick={openModal(
                        <NameModal
                            name={name}
                            setName={(val) => {
                                setPage(1)
                                setName(val)
                            }}
                        />
                    )}
                    disabled={loading}
                >
                    Search Character 🔎
                </button>
                {name && (
                    <>
                        <button style="Secondary" disabled>
                            Current search: {name}
                        </button>
                        <button
                            style="Secondary"
                            onClick={() => setName("")}
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
                setPage={setPage}
            />
        </message>
    )
}
