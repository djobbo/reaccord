# Counter

```tsx
import { useState } from "react"

const Counter = () => {
	const [count, setCount] = useState(0)

	const increment = () => setCount((count) => count + 1)

	const decrement = () => setCount((count) => count - 1)

	return (
		<action-row>
			<button onClick={decrement} style="Danger">
				-
			</button>
			<button style="Secondary" disabled>
				{count}
			</button>
			<button onClick={increment} style="Danger">
				+
			</button>
		</action-row>
	)
}
```
