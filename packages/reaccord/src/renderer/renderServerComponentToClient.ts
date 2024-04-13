import type { ReactNode } from "react"

export const renderServerComponentToClient = async (
  Code: JSX.Element,
): Promise<ReactNode> => {
  if (!Code) return null

  if (Array.isArray(Code)) {
    const jsx = (await Promise.all(
      Code.map(renderServerComponentToClient),
    )) as JSX.Element[] // We are sure that this is an array of JSX elements
    return jsx
  }

  if (typeof Code !== "object") return Code

  if (Code.$$typeof === Symbol.for("react.element")) {
    console.log(Code.type, typeof Code.type, Code.type === "string")
    if (typeof Code.type === "string") {
      return { ...Code, props: await renderServerComponentToClient(Code.props) }
    }

    if (typeof Code.type === "function") {
      console.log(Code.type.$$typeof)
      const Component = Code.type
      const props = Code.props
      const renderedComponent = await Component(props)
      console.log("renderedComponent", renderedComponent)
      //   throw new Error("Function components are not supported yet")
      return await renderServerComponentToClient(renderedComponent)
    }

    return Object.fromEntries(
      await Promise.all(
        Object.entries(Code).map(async ([key, value]) => [
          key,
          await renderServerComponentToClient(value),
        ]),
      ),
    )
  }

  return Code
}

const escapeJsx = (key, value) => {
  if (value === Symbol.for("react.element")) {
    return "$"
  }
  return value
}
