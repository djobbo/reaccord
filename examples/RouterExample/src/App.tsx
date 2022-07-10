import { Link, Route, Routes, useLocation, useNavigate } from "@reaccord/router"
import { useEffect } from "react"
import { useMessageCtx, useOnReactionAdd } from "reaccord"

export const App = () => {
    const { pathname } = useLocation()
    const goto = useNavigate()
    const { message } = useMessageCtx()

    useEffect(() => {
        message.react("🏠")
        message.react("👤")
        message.react("📙")
        goto("/profile")
    }, [])

    useOnReactionAdd(
        async (reaction, user) => {
            switch (reaction.emoji.name) {
                case "🏠":
                    goto("/")
                    break
                case "👤":
                    goto("/profile")
                    break
                case "📙":
                    goto("/about")
                    break
                default:
                    break
            }

            reaction.users.remove(user.id)
        },
        [],
        { allowBot: false },
    )

    return (
        <>
            <Routes>
                <Route path="/">
                    <Route
                        path="/"
                        // @ts-expect-error wrong react type
                        element={
                            <embed>
                                <title>Home</title>
                            </embed>
                        }
                    />
                    <Route
                        path="/profile"
                        // @ts-expect-error wrong react type
                        element={
                            <embed>
                                <title>Profile</title>
                            </embed>
                        }
                    />
                    <Route
                        path="/about"
                        // @ts-expect-error wrong react type
                        element={
                            <embed>
                                <title>About</title>
                            </embed>
                        }
                    />
                </Route>
            </Routes>
            <content>
                <codeblock lang="yml">
                    path:
                    {pathname}
                </codeblock>
            </content>
            <action-row>
                <Link to="/" style={pathname === "/" ? "SUCCESS" : "SECONDARY"}>
                    Home
                </Link>
                <Link
                    to="/profile"
                    style={pathname === "/profile" ? "SUCCESS" : "SECONDARY"}
                >
                    Profile
                </Link>
                <Link
                    to="/about"
                    style={pathname === "/about" ? "SUCCESS" : "SECONDARY"}
                >
                    About
                </Link>
            </action-row>
        </>
    )
}
