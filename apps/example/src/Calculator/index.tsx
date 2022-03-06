import { Accessor, createEffect, createSignal } from "solid-js"

const buttons = [
    ["C", "+-", "%", "/"],
    ["7", "8", "9", "X"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
] as const

const [sign, setSign] = createSignal("+")
const [num, setNum] = createSignal("0")
const [saved, setSaved] = createSignal(0)
const [display, setDisplay] = createSignal("0")

const numClickHandler = (numStr: string) => {
    console.log({ numStr })
    setNum((num) => (num.length < 16 ? num + numStr : num))
    setSign("")
}

const commaClickHandler = () => {
    setNum((num) => (num.includes(".") ? num : num + "."))
    setSign("")
}

const signClickHandler = (signStr: string) => {
    setSign(signStr)
    setSaved(parseFloat(num()))
    setNum("0")
}

const equalsClickHandler = () => {
    setDisplay(
        num() === "0" && sign() === "/"
            ? "Can't divide with 0"
            : calc(saved(), parseFloat(num()), sign()).toString()
    )

    setNum("0")
    setSaved(0)
    setSign("")
}

const invertClickHandler = () => {
    setNum((num) => (parseFloat(num) * -1).toString())
    setSaved((saved) => saved * -1)
    setSign("")
}

const percentClickHandler = () => {
    setNum((num) => (parseFloat(num) / 100).toString())
    setSaved((saved) => saved / 100)
    setSign("")
}

const resetClickHandler = () => {
    setNum("0")
    setSaved(0)
    setSign("")
}

const Buttons = ({ onClick }: { onClick: (btn: string) => void }) => {
    return buttons.map((row) => (
        <action-row>
            {row.map((btn) => (
                <button
                    onClick={() => {
                        console.log(btn)
                        onClick(btn)
                    }}
                    style={
                        ["C", "+-", "%"].includes(btn)
                            ? "Secondary"
                            : ["/", "X", "-", "+"].includes(btn)
                            ? "Success"
                            : btn === "="
                            ? "Danger"
                            : "Primary"
                    }
                >
                    {btn}
                </button>
            ))}
        </action-row>
    ))
}

const Screen = () => {
    return (
        <embed>
            <title>{display()}</title>
        </embed>
    )
}

const calc = (a: number, b: number, sign: string) =>
    sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b

export const Calculator = () => {
    return (
        <>
            <Screen />
            <Buttons
                onClick={(btn) => {
                    switch (btn) {
                        case "C":
                            resetClickHandler()
                            break
                        case "+-":
                            invertClickHandler()
                            break
                        case "%":
                            percentClickHandler()
                            break
                        case "=":
                            equalsClickHandler()
                            break
                        case "/":
                        case "X":
                        case "-":
                        case "+":
                            signClickHandler(btn)
                            break
                        case ".":
                            commaClickHandler()
                            break
                        default:
                            numClickHandler(btn)
                            break
                    }
                }}
            />
        </>
    )
}
