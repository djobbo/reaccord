import { MessageProvider } from "../hooks/MessageContext"
import type { RootNode } from "./RootNode"

export const renderWithRootContext = async (
  Code: () => JSX.Element | Promise<JSX.Element>,
  rootNode: RootNode,
) => {
  return (
    <MessageProvider rootNode={rootNode}>
      <Code />
    </MessageProvider>
  )
}
