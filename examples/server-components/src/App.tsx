const getData = async (search: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return search
}

type AppProps = {
  search: string
}

export const App: any = async ({ search }: AppProps) => {
  const test = await getData(search)

  return <>{test}</>
}
