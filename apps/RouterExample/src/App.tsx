import { Link, Route, Routes, useLocation } from "@reaccord/router"

export const App = () => {
    const { pathname } = useLocation()

    return (
        <message>
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
        </message>
    )
}
