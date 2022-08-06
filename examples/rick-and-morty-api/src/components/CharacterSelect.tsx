import { ActionRow, Option, Select } from "reaccord"
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
    <ActionRow>
      <Select onChange={([val]) => onSelectCharacter(val)} disabled={isLoading}>
        {characters.map((char, i) => (
          <Option
            key={char.id}
            label={char.name}
            value={char.id.toString()}
            description={`${char.species} - ${char.status}`}
            default={character ? char.id === character.id : i === 0}
          />
        ))}
      </Select>
    </ActionRow>
  )
}
