import { Color, Embed, Field, Thumb, Title } from "reaccord"
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
			<Embed>
				<Title>Loading</Title>
				<Color color="Orange" />
			</Embed>
		)

	if (!character)
		return (
			<Embed>
				<Title>Failed to fetch data, please retry</Title>
				<Color color="Red" />
			</Embed>
		)

	return (
		<Embed>
			<Title>{character.name}</Title>
			<Field title="Species" inline>
				{character.species ?? "unknown"}
			</Field>
			<Field title="Status">{character.status ?? "unknown"}</Field>
			<Field title="Current location" inline>
				{character.location.name ?? "unknown"}
			</Field>
			<Field title="Origin">{character.origin.name ?? "unknown"}</Field>
			{character.image && <Thumb src={character.image} />}
			<Color
				color={getColorFromCharacterStatus(
					character.status ?? "unknown",
				)}
			/>
		</Embed>
	)
}
