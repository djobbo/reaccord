import { Accessor, Setter } from 'solid-js'

type NavigationProps = {
    data: Accessor<APIResponse | null>
    setPage: Setter<number>
    loading: Accessor<boolean>
    page: Accessor<number>
}

export const Navigation = ({data, setPage, loading, page}: NavigationProps) => {

    const setCurrentPage = (newPage: number) => {
        setPage((page) => {
            const pageInfo = data()?.info
            if (!pageInfo) return page

            if (newPage > pageInfo.count) return pageInfo.count
            if (newPage < 1) return 1

            return newPage
        })
    }

    return (
        <action-row>
            <button style="Secondary" onClick={() => setCurrentPage(1)} disabled={loading()}>
                {"<<"}
            </button>
            <button style="Primary" onClick={() => setCurrentPage(page() - 1)} disabled={loading()}>
                {"<"}
            </button>
            <button style="Secondary" disabled>
                Page {page()}
                {data()?.info && ` / ${data()?.info.count}`}
            </button>
            <button style="Primary" onClick={() => setCurrentPage(page() + 1)} disabled={loading()}>
                {">"}
            </button>
            <button
                style="Secondary"
                onClick={() => setCurrentPage((data()?.info.count ?? 2) - 1)}
                disabled={loading()}
            >
                {">>"}
            </button>
        </action-row>
    )
}
