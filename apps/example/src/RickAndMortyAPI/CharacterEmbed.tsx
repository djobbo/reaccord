import { Accessor } from "solid-js"

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

export const CharacterEmbed = ({ data }: { data: Accessor<Character | undefined> }) => {
    if (!data())
        return (
            <embed>
                <title>Failed to fetch data, please retry</title>
                <color color="Red" />
            </embed>
        )

    return (
        <embed>
            <title>{data()?.name}</title>
            <field title="Species" inline>
                {data()?.species ?? "unknown"}
            </field>
            <field title="Status">{data()?.status ?? "unknown"}</field>
            <field title="Current location" inline>
                {data()?.location.name ?? "unknown"}
            </field>
            <field title="Origin">{data()?.origin.name ?? "unknown"}</field>
            {data()?.image && <thumbnail src={data()?.image ?? ""} />}
            <color color={getColorFromCharacterStatus(data()?.status ?? "unknown")} />
        </embed>
    )
}
