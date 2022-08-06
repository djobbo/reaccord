import { Button } from "reaccord"
import { useNavigate } from "react-router"
import type { ReaccordElement } from "reaccord"
import type { To } from "react-router"

export type LinkProps = {
  replace?: boolean
  state?: any
  to: To
} & ReaccordElement["Button"]

export const Link = ({ replace = false, state, to, ...rest }: LinkProps) => {
  const navigate = useNavigate()
  return <Button {...rest} onClick={() => navigate(to, { replace, state })} />
}
