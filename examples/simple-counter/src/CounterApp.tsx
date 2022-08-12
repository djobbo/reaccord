import { ActionRow, Button, ButtonStyle, Content } from "reaccord"
import { useEffect, useRef, useState } from "react"

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)
  const increment = () => setCount((count) => count + 1)

  return (
    <>
      <Content>Count: {count}</Content>
      <ActionRow>
        <Button onClick={increment} style={ButtonStyle.Primary}>
          +
        </Button>
      </ActionRow>
    </>
  )
}

export default CounterApp
