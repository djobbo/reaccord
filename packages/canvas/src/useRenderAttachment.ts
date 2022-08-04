import { AttachmentBuilder } from "discord.js"
import { Readable } from "node:stream"
import { renderToImageBuffer } from "./render"
import { useQuery } from "@tanstack/react-query"
import { v4 } from "uuid"
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query"
import type { ReactElement } from "react"
import type { RenderContext, Options as RenderOptions } from "./render"

type Options<TQueryKey extends QueryKey> = {
	queryOptions?: UseQueryOptions<
		AttachmentBuilder,
		unknown,
		AttachmentBuilder,
		TQueryKey
	>
} & RenderOptions

/**
 * A valid `@tanstack/react-query` setup is required for this hook to work.
 * @see https://tanstack.com/query/v4/docs/quick-start
 */
export const useRenderAttachment = <TQueryKey extends QueryKey>(
	queryKey: TQueryKey,
	Element: (props: RenderContext) => ReactElement,
	{ queryOptions, ...renderOptions }: Options<TQueryKey> = {},
) => {
	return useQuery(
		queryKey,
		async () => {
			const imageBuffer = await renderToImageBuffer(
				Element,
				renderOptions,
			)

			const imageStream = Readable.from(imageBuffer)
			const imageFile = new AttachmentBuilder(imageStream).setName(
				`${v4()}.${renderOptions.screenshotOptions?.type ?? "png"}`,
			)

			return imageFile
		},
		queryOptions,
	)
}
