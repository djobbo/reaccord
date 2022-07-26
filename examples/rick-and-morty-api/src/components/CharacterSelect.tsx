import type { Character } from "../types"

type CharacterSelectProps = {
    characters: Character[]
    character: Character | undefined
    onSelectCharacter: (val: string) => void
    isLoading?: boolean
}

export const CharacterSelect = ({
    characters,
    character,
    onSelectCharacter,
    isLoading,
}: CharacterSelectProps) => {
    return (
        <action-row>
            <select
                onChange={([val]) => onSelectCharacter(val)}
                disabled={isLoading}
            >
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
