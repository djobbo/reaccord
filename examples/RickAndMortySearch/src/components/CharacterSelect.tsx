import type { Character } from "../types"

type CharacterSelectProps = {
    characters: Character[]
    character: Character | undefined
    onSelectCharacter: (val: string) => void
}

export const CharacterSelect = ({
    characters,
    character,
    onSelectCharacter,
}: CharacterSelectProps) => {
    return (
        <action-row>
            <select onChange={([val]) => onSelectCharacter(val)}>
                {characters.map((char, i) => (
                    <option
                        key={char.id}
                        label={char.name}
                        value={char.id.toString()}
                        description={`${char.species} - ${char.status}`}
                        default={character ? char.id === character.id : i === 0}
                    />
                ))}
            </select>
        </action-row>
    )
}
