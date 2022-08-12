import { ActionRow, Button, ButtonStyle, Content } from "reaccord"
import { useEffect, useRef, useState } from "react"

// Define app behavior
type CounterAppProps = {
  start?: number
}

export const CounterApp = ({ start = 0 }: CounterAppProps) => {
  const [count, setCount] = useState(start)
  const increment = () => setCount((count) => count + 1)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      console.log("tick " + count)
      increment()
    }, 2000)

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [count])

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
