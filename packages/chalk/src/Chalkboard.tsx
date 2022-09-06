import { CodeBlock } from "reaccord"
import type { ReactNode } from "react"

export type ChalkboardProps = {
  width?: number
  height?: number
  children: ReactNode
}

export const Chalkboard = ({ children }: ChalkboardProps) => {
  return <CodeBlock lang="ansi">{children}</CodeBlock>
}
