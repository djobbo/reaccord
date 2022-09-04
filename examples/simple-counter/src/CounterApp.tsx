import { ActionRow } from "reaccord"
import { ButtonStyle } from "discord.js"
import { useState } from "react"

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)
  const increment = () => setCount((count) => count + 1)

  return (
    <>
      {count}
      <ActionRow>
        <ActionRow.Button
          customId="increment"
          onClick={increment}
          style={ButtonStyle.Primary}
        >
          +
        </ActionRow.Button>
      </ActionRow>
    </>
  )
}

export default CounterApp
