import { Link, Route, Routes, useLocation, useNavigate } from "@reaccord/router"
import { useEffect } from "react"
import { useMessageCtx, useReactionAddEffect } from "@reaccord/core"

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

    useReactionAddEffect(
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
                        element={
                            <embed>
                                <title>Home</title>
                            </embed>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <embed>
                                <title>Profile</title>
                            </embed>
                        }
                    />
                    <Route
                        path="/about"
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
                <Link to="/" style={pathname === "/" ? "Success" : "Secondary"}>
                    Home
                </Link>
                <Link
                    to="/profile"
                    style={pathname === "/profile" ? "Success" : "Secondary"}
                >
                    Profile
                </Link>
                <Link
                    to="/about"
                    style={pathname === "/about" ? "Success" : "Secondary"}
                >
                    About
                </Link>
            </action-row>
        </>
    )
}
