import { Image, Thumb } from "reaccord"
import { useRenderImageFile } from "./useRenderAttachment"
import type { QueryKey } from "@tanstack/react-query"
import type { ReactElement, ReactNode } from "react"
import type { RenderContext } from "./render"
import type { RenderImageFileQueryOptions } from "./useRenderAttachment"

const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

// TODO: add placeholder image src
export type CanvasImageProps<Key extends QueryKey | string> = {
	id: Key
	children: ReactNode | ((context: RenderContext) => ReactElement)
	width?: number
	height?: number
	options?: RenderImageFileQueryOptions<Key extends string ? [Key] : Key>
	as?: "Image" | "Thumb"
}

export const CanvasImage = <Key extends QueryKey | string>({
	id,
	children,
	width,
	height,
	options,
	as = "Image",
}: CanvasImageProps<Key>) => {
	const { imageFile } = useRenderImageFile(
		typeof id === "string" ? [id] : id,
		typeof children === "function" ? children : () => <>{children}</>,
		// @ts-expect-error - wontfix for now
		{
			...options,
			...{
				viewport: {
					width: width ?? DEFAULT_WIDTH,
					height: height ?? DEFAULT_HEIGHT,
					...options?.viewport,
				},
			},
		},
	)

	if (!imageFile) return null

	switch (as) {
		case "Thumb":
			return <Thumb file={imageFile} />
		default:
			return <Image file={imageFile} />
	}
}
