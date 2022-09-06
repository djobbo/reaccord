import { Chalk, Chalkboard } from "@reaccord/chalk"
import { EMPTY_STRING } from "reaccord/lib/helpers/constants"
import { useReceivedReply } from "reaccord"
import { useState } from "react"

const LINE_COUNT = 8

export const Console = () => {
  const [lines, setLines] = useState<string[]>(
    Array.from({ length: LINE_COUNT }, () => ""),
  )

  useReceivedReply(async (reply) => {
    setLines((lines) => {
      let newLines = [...lines, reply.content]

      if (newLines.length > LINE_COUNT) {
        newLines.shift()
      }

      return newLines
    })

    await reply.delete()
  }, [])

  return (
    <Chalkboard>
      {lines.map((line, i) => (
        <Chalk key={i} br>
          <Chalk fg={Chalk.FG.Red}>{"> "}</Chalk>
          <Chalk fg={Chalk.FG.Green}>{line || EMPTY_STRING}</Chalk>
        </Chalk>
      ))}
      <Chalk fg={Chalk.FG.Blue}>{">"}</Chalk>
    </Chalkboard>
  )
}
