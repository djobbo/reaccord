import { Button } from "reaccord"
import { useState } from "react"

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)

  return (
    <>
      {count}
      <Button onClick={() => setCount((count) => count + 1)}>+</Button>
    </>
  )
}

export default CounterApp
