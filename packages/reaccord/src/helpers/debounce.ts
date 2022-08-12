export const debounce = <T extends unknown[], ReturnType>(
  fn: (...args: T) => ReturnType,
  ms = 300,
) => {
  let timeoutId: NodeJS.Timeout
  return (...args: T) =>
    new Promise<ReturnType>((resolve) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        resolve(await fn(...args))
      }, ms)
    })
}
