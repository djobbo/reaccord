import type {
	ButtonInteraction,
	ButtonStyle,
	ColorResolvable,
	ModalSubmitInteraction,
	SelectMenuInteraction,
} from "discord.js"
import type { ReactElement } from "react"

export namespace JSX {
	type Element =
		| ReactElement
		| ArrayElement
		| FunctionElement
		| (string & {})
		| number
		| boolean
		| null
		| undefined
	interface ArrayElement extends Array<Element> {}
	interface FunctionElement {
		(): Element
	}
	interface ElementClass {
		render(props: any): Element
	}
	interface BaseAttributes {
		key?: number | string | null
	}
	// Text
	interface LineBreakAttributes {}
	interface CodeAttributes {
		children?: Element
	}
	interface CodeBlockAttributes {
		lang: string
		children?: Element
		multiline?: boolean
	}
	interface SpanAttributes {
		italic?: boolean
		bold?: boolean
		children?: Element
	}
	// Content
	interface ContentAttributes {
		children?: Element
	}
	// Embed
	interface AnchorAttributes {
		href: string
		children?: Element
	}
	interface EmbedAttributes {
		children?: Element
	}
	interface AuthorAttributes {
		name: Element
		url?: string
		iconURL?: string
	}
	interface ColorAttributes {
		color: ColorResolvable
	}
	interface DescriptionAttributes {
		children?: Element
	}
	interface FooterAttributes {
		children?: Element
		iconURL?: string
	}
	interface ImageAttributes {
		src: string
	}
	interface ThumbnailAttributes {
		src: string
	}
	interface TimestampAttributes {
		timestamp?: Date | number | null
	}
	interface TitleAttributes {
		children?: Element
	}
	interface UrlAttributes {
		href: string
	}
	interface FieldAttributes {
		title: string
		children?: Element
		inline?: boolean
	}
	// Components
	interface ActionRowAttributes {
		children?: Element
	}
	interface ModalRowAttributes {
		children?: Element
	}
	interface ButtonAttributes {
		id?: string
		/**
		 * By default, onClick will trigger a defered update, to prevent this, return a truthy value
		 */
		onClick?: (interaction: ButtonInteraction) => any | Promise<any>
		children?: Element
		disabled?: boolean
		style?: ButtonStyle
	}
	interface SelectAttributes {
		id?: string
		/**
		 * By default, onChange will trigger a defered update, to prevent this, return a truthy value
		 */
		onChange?: (
			values: string[],
			interaction: SelectMenuInteraction,
		) => any | Promise<any>
		children?: Element
		disabled?: boolean
	}
	interface OptionAttributes {
		default?: boolean
		description?: string
		label?: string
		value?: string
	}
	interface TextInputAttributes {
		id?: string
		onChange?: (
			value: string,
			interaction: ModalSubmitInteraction,
		) => any | Promise<any>
		label?: string
		value?: string
		placeholder?: string
		required?: boolean
		large?: boolean
	}
	interface ModalAttributes {
		id?: string
		children?: Element[]
		title: string

		/**
		 * By default, onSubmit will trigger a message and then delete it
		 * in order to respond to the interaction.
		 * To prevent this, return a truthy value
		 */
		onSubmit?: (interaction: ModalSubmitInteraction) => any | Promise<any>
	}
	interface IntrinsicElements {
		// Text
		a: AnchorAttributes & BaseAttributes
		br: LineBreakAttributes & BaseAttributes
		code: CodeAttributes & BaseAttributes
		codeblock: CodeBlockAttributes & BaseAttributes
		span: SpanAttributes & BaseAttributes
		// Content
		content: ContentAttributes & BaseAttributes
		// Embed
		embed: EmbedAttributes & BaseAttributes
		author: AuthorAttributes & BaseAttributes
		color: ColorAttributes & BaseAttributes
		desc: DescriptionAttributes & BaseAttributes
		img: ImageAttributes & BaseAttributes
		thumbnail: ThumbnailAttributes & BaseAttributes
		timestamp: TimestampAttributes & BaseAttributes
		title: TitleAttributes & BaseAttributes
		url: UrlAttributes & BaseAttributes
		field: FieldAttributes & BaseAttributes
		footer: FooterAttributes & BaseAttributes
		// Action Row
		"action-row": ActionRowAttributes & BaseAttributes
		button: ButtonAttributes & BaseAttributes
		select: SelectAttributes & BaseAttributes
		option: OptionAttributes & BaseAttributes
		// Modal
		modal: ModalAttributes & BaseAttributes
		"modal-row": ModalRowAttributes & BaseAttributes
		input: TextInputAttributes & BaseAttributes
	}
}
