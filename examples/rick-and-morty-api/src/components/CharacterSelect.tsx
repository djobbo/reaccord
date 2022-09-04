import { SelectMenu } from "reaccord"
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
    <SelectMenu
      customId="character-select"
      onChange={([val]) => onSelectCharacter(val)}
      disabled={isLoading}
    >
      {characters.map((char, i) => (
        <SelectMenu.Option
          key={char.id}
          value={char.id.toString()}
          description={`${char.species} - ${char.status}`}
          default={character ? char.id === character.id : i === 0}
        >
          {char.name}
        </SelectMenu.Option>
      ))}
    </SelectMenu>
  )
}
