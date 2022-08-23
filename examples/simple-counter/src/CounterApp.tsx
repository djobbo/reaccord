import { ActionRow, Button, ButtonStyle } from "reaccord"
import { useState } from "react"

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)
  const increment = () => {
    setCount((count) => count + 1)
    console.log("asdasdsada")
  }

  return (
    <>
      Count: {count}
      <ActionRow>
        <Button id="increment" onClick={increment} style={ButtonStyle.Primary}>
          +
        </Button>
      </ActionRow>
    </>
  )
}

export default CounterApp
