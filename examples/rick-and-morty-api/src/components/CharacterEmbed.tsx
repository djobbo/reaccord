import { Embed, Field, Thumbnail, Title } from "reaccord"
import type { Character, CharacterStatus } from "../types"
import type { ColorResolvable } from "reaccord"

const getColorFromCharacterStatus = (
  status: CharacterStatus,
): ColorResolvable => {
  switch (status) {
    case "Alive":
      return "Green"
    case "Dead":
      return "Red"
    default:
      return "Default"
  }
}

type CharacterEmbedProps = {
  character?: Character
  isLoading?: boolean
}

export const CharacterEmbed = ({
  character,
  isLoading,
}: CharacterEmbedProps) => {
  if (isLoading)
    return (
      <Embed color="Orange">
        <Title>Loading</Title>
      </Embed>
    )

  if (!character)
    return (
      <Embed color="Red">
        <Title>Failed to fetch data, please retry</Title>
      </Embed>
    )

  return (
    <Embed color={getColorFromCharacterStatus(character.status ?? "unknown")}>
      <Title>{character.name}</Title>
      <Field title="Species" inline>
        {character.species ?? "unknown"}
      </Field>
      <Field title="Status">{character.status ?? "unknown"}</Field>
      <Field title="Current location" inline>
        {character.location.name ?? "unknown"}
      </Field>
      <Field title="Origin">{character.origin.name ?? "unknown"}</Field>
      {character.image && <Thumbnail src={character.image} />}
    </Embed>
  )
}
