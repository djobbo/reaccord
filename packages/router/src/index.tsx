import { JSX } from "@reaccord/react/jsx-runtime"
import {
    MemoryRouter,
    MemoryRouterProps,
    Navigate,
    Outlet,
    Route,
    Router,
    Routes,
    createPath,
    createRoutesFromChildren,
    generatePath,
    matchPath,
    matchRoutes,
    parsePath,
    renderMatches,
    resolvePath,
    useHref,
    useInRouterContext,
    useLocation,
    useMatch,
    useNavigate,
    useNavigationType,
    useOutlet,
    useOutletContext,
    useParams,
    useResolvedPath,
    useRoutes,
} from "react-router"
import type { To } from "react-router"

export {
    MemoryRouter,
    Navigate,
    Outlet,
    Route,
    Router,
    Routes,
    createRoutesFromChildren,
    generatePath,
    matchRoutes,
    matchPath,
    createPath,
    parsePath,
    resolvePath,
    renderMatches,
    useHref,
    useInRouterContext,
    useLocation,
    useMatch,
    useNavigate,
    useNavigationType,
    useOutlet,
    useParams,
    useResolvedPath,
    useRoutes,
    useOutletContext,
}

export { NavigationType } from "react-router"
export type {
    Hash,
    IndexRouteProps,
    LayoutRouteProps,
    Location,
    MemoryRouterProps,
    NavigateFunction,
    NavigateOptions,
    NavigateProps,
    Navigator,
    OutletProps,
    Params,
    Path,
    PathMatch,
    PathRouteProps,
    RouteMatch,
    RouteObject,
    RouteProps,
    RouterProps,
    RoutesProps,
    Pathname,
    Search,
    To,
} from "react-router"

export interface DiscordRouterProps extends MemoryRouterProps {}

export const DiscordRouter = (props: DiscordRouterProps) => {
    return <MemoryRouter {...props} />
}

export type LinkProps = {
    replace?: boolean
    state?: any
    to: To
} & JSX.ButtonAttributes

export const Link = ({ replace = false, state, to, ...rest }: LinkProps) => {
    const navigate = useNavigate()
    return <button {...rest} onClick={() => navigate(to, { replace, state })} />
}
