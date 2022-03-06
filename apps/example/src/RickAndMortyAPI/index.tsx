import { createEffect, createSignal } from "solid-js"
import { openModal } from "../setupApp"
import { CharacterEmbed } from "./CharacterEmbed"
import { fetchCharacters } from "./fetch"
import { NameModal } from "./NameModal"
import { Navigation } from "./Navigation"

export const RickAndMortyApp = () => {
    const [name, setName] = createSignal("")
    const [page, setPage] = createSignal(1)
    const [data, setData] = createSignal<APIResponse | null>(null)
    const [loading, setLoading] = createSignal(false)
    const [character, setCharacter] = createSignal<Character | undefined>(undefined)

    createEffect(() => {
        setLoading(true)
        fetchCharacters(name(), page())
            .then((res) => {
                setData(res)
                setCharacter(res.results[0])
            })
            .catch(() => {
                setData(null)
                setCharacter(undefined)
            })
            .finally(() => setLoading(false))
    })

    return (
        <>
            {loading() ? (
                <embed>
                    <title>Loading</title>
                    <color color="Orange" />
                </embed>
            ) : (
                <CharacterEmbed data={character} />
            )}
            {data() && (
                <action-row>
                    <select
                        onChange={([val]) => {
                            setCharacter(data()?.results.find((char) => char.id.toString() === val))
                        }}
                    >
                        {data()?.results.map((char, i) => (
                            <option
                                label={char.name}
                                value={char.id.toString()}
                                description={`${char.species} - ${char.status}`}
                                default={character() ? char.id === character()?.id : i === 0}
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
                    disabled={loading()}
                >
                    Search Character 🔎
                </button>
                {name() && (
                    <button style="Secondary" disabled>
                        Current search: {name()}
                    </button>
                )}
            </action-row>
            <Navigation data={data} loading={loading} page={page} setPage={setPage} />
        </>
    )
}
