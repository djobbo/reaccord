import { EMPTY_STRING } from "@reaccord/core"

export const Empty = ({ length }: { length: number }) => {
    return (
        <embed>
            <color color="Random" />
            {Array.from({ length }, () => (
                <field title={EMPTY_STRING}>{EMPTY_STRING}</field>
            ))}
        </embed>
    )
}
