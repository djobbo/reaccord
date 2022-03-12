import { useNavigate } from "react-router"
import type { JSX } from "@reaccord/core/jsx-runtime"
import type { To } from "react-router"

export type LinkProps = {
    replace?: boolean
    state?: any
    to: To
} & JSX.ButtonAttributes

export const Link = ({ replace = false, state, to, ...rest }: LinkProps) => {
    const navigate = useNavigate()
    return <button {...rest} onClick={() => navigate(to, { replace, state })} />
}
