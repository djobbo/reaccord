import type { APIResponse } from "./types"
import type { Dispatch, SetStateAction } from "react"

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

            if (newPage > pageInfo.pages) return pageInfo.pages
            if (newPage < 1) return 1

            return newPage
        })
    }

    return (
        <action-row>
            <button
                style="Secondary"
                onClick={() => setCurrentPage(1)}
                disabled={loading || page <= 1}
            >
                {"<<"}
            </button>
            <button
                style="Primary"
                onClick={() => setCurrentPage(page - 1)}
                disabled={loading || page <= 1}
            >
                {"<"}
            </button>
            <button style="Secondary" disabled>
                Page {page}
                {data?.info && ` / ${data.info.pages}`}
            </button>
            <button
                style="Primary"
                onClick={() => setCurrentPage(page + 1)}
                disabled={loading || (!!data && data.info.pages <= page)}
            >
                {">"}
            </button>
            <button
                style="Secondary"
                onClick={() => setCurrentPage(data?.info.pages ?? 1)}
                disabled={loading || (!!data && data.info.pages <= page)}
            >
                {">>"}
            </button>
        </action-row>
    )
}
