import { openModal } from "../"
import { render } from "../renderer"
import { useMessageCtx } from "./MessageContext"

export const useModal = () => {
    const { client, message } = useMessageCtx()

    return { openModal: openModal(render, client, message) }
}
