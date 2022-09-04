import { ActionRow } from "reaccord"
import { ButtonStyle } from "discord.js"
import type { PageInfo } from "../types"

type NavigationProps = {
  pageInfo?: PageInfo
  setPage: (page: number) => void
  loading: boolean
  page: number
}

export const Navigation = ({
  pageInfo,
  setPage,
  loading,
  page,
}: NavigationProps) => {
  const setCurrentPage = (newPage: number) => {
    if (!pageInfo) return setPage(1)

    if (newPage > pageInfo.pages) return setPage(pageInfo.pages)
    if (newPage < 1) return setPage(1)

    return setPage(newPage)
  }

  return (
    <ActionRow>
      <ActionRow.Button
        customId="nav-first"
        style={ButtonStyle.Secondary}
        onClick={() => setCurrentPage(1)}
        disabled={loading || page <= 1}
      >
        {"<<"}
      </ActionRow.Button>
      <ActionRow.Button
        customId="nav-previous"
        style={ButtonStyle.Primary}
        onClick={() => setCurrentPage(page - 1)}
        disabled={loading || page <= 1}
      >
        {"<"}
      </ActionRow.Button>
      <ActionRow.Button
        customId="nav-count"
        style={ButtonStyle.Secondary}
        disabled
      >
        Page {page}
        {pageInfo && ` / ${pageInfo.pages}`}
      </ActionRow.Button>
      <ActionRow.Button
        customId="nav-next"
        style={ButtonStyle.Primary}
        onClick={() => setCurrentPage(page + 1)}
        disabled={loading || (!!pageInfo && pageInfo.pages <= page)}
      >
        {">"}
      </ActionRow.Button>
      <ActionRow.Button
        customId="nav-last"
        style={ButtonStyle.Secondary}
        onClick={() => setCurrentPage(pageInfo?.pages ?? 1)}
        disabled={loading || (!!pageInfo && pageInfo.pages <= page)}
      >
        {">>"}
      </ActionRow.Button>
    </ActionRow>
  )
}
