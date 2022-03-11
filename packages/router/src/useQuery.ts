import { useEffect } from "react"
import { useLocation } from "react-router"
import qs from "query-string"
import type { ParseOptions, ParsedQuery } from "query-string"

export const useQuery = <T extends ParsedQuery = ParsedQuery>(
    options: ParseOptions = {}
) => {
    const { search } = useLocation()

    useEffect(() => {
        console.log(qs.parse(search, options))
    })

    return qs.parse(search, options) as T
}
