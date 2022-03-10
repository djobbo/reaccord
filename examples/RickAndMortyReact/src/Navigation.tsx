import { APIResponse } from "./types"
import { Dispatch, SetStateAction } from "react"

type NavigationProps = {
    data: APIResponse | null
    setPage: Dispatch<SetStateAction<number>>
    loading: boolean
    page: number
}

export const Navigation = ({
    data,
    setPage,
    loading,
    page,
}: NavigationProps) => {
    const setCurrentPage = (newPage: number) => {
        setPage(() => {
            const pageInfo = data?.info
            if (!pageInfo) return 1

            if (newPage > pageInfo.count) return pageInfo.count
            if (newPage < 1) return 1

            return newPage
        })
    }

    return (
        <action-row>
            <button
                style="Secondary"
                onClick={() => setCurrentPage(1)}
                disabled={loading}
            >
                {"<<"}
            </button>
            <button
                style="Primary"
                onClick={() => setCurrentPage(page - 1)}
                disabled={loading}
            >
                {"<"}
            </button>
            <button style="Secondary" disabled>
                Page {page}
                {data?.info && ` / ${data.info.count}`}
            </button>
            <button
                style="Primary"
                onClick={() => setCurrentPage(page + 1)}
                disabled={loading}
            >
                {">"}
            </button>
            <button
                style="Secondary"
                onClick={() => setCurrentPage((data?.info.count ?? 2) - 1)}
                disabled={loading}
            >
                {">>"}
            </button>
        </action-row>
    )
}
