import { openModal } from "@reaccord/core"
import { useMessageCtx } from "./MessageContext"
import { render } from "./renderer"

export const useModal = () => {
    const {client, message} = useMessageCtx()

    return { openModal: openModal(render, client, message) }
}
