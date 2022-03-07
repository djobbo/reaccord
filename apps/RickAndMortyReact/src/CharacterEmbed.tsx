import { useEffect } from "react"
import { Character, CharacterStatus } from "./types"

const getColorFromCharacterStatus = (status: CharacterStatus) => {
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
}

export const CharacterEmbed = ({ character }: CharacterEmbedProps) => {
    if (!character)
        return (
            <embed>
                <title>Failed to fetch data, please retry</title>
                <color color="Red" />
            </embed>
        )

    return (
        <embed>
            <title>{character.name}</title>
            <field title="Species" inline>
                {character.species ?? "unknown"}
            </field>
            <field title="Status">{character.status ?? "unknown"}</field>
            <field title="Current location" inline>
                {character.location.name ?? "unknown"}
            </field>
            <field title="Origin">{character.origin.name ?? "unknown"}</field>
            {character.image && <thumbnail src={character.image} />}
            <color color={getColorFromCharacterStatus(character.status ?? "unknown")} />
        </embed>
    )
}
