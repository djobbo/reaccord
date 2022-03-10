import { reaccord as base } from "@reaccord/core"

import { render } from "./renderer"

export const reaccord = base(render)

export * from "./MessageContext"
export * from "./useModal"
