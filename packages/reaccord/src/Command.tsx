import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	Message,
	User,
} from "discord.js"
import type {
	ChatInputApplicationCommandData,
	CommandInteraction,
	GuildBasedChannel,
	GuildMember,
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	Role,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction,
} from "discord.js"
import type { JSX } from "../jsx-runtime"
import type { MessageResponseOptions } from "./nodes"
import type { RenderMessageFn } from "./renderer/renderMessage"

type CommandParamOptions<Required extends boolean = false> = {
	type: ApplicationCommandOptionType
	required?: Required
}

type CommandInteractionCallback<Props, InteractionType, ReturnValue> = (
	props: Props,
	interaction: InteractionType,
) => ReturnValue

export class ChatInputCommand<Props extends { [k in string]: any } = {}> {
	#renderMessage?: (
		messageResponseOptions?: MessageResponseOptions,
	) => RenderMessageFn
	#params: string[]
	#interactionCallback?: CommandInteractionCallback<
		Props,
		CommandInteraction,
		void
	>
	slashCommand: ChatInputApplicationCommandData
	#messageResponseOptions: MessageResponseOptions = {}

	constructor(
		name: string,
		description: string,
		messageResponseOptions?: MessageResponseOptions,
	) {
		// TODO: check for builder in a later update
		// this.slashCommand = new SlashCommandBuilder()
		// this.slashCommand.setName(name)
		// this.slashCommand.setDescription(description ?? EMPTY_STRING)

		this.slashCommand = {
			name,
			description,
			options: [],
		}

		this.#params = []
		this.#messageResponseOptions = {
			...this.#messageResponseOptions,
			...messageResponseOptions,
		}
	}

	setRenderMessageFn(
		fn: (
			messageResponseOptions?: MessageResponseOptions,
		) => RenderMessageFn,
	): void {
		this.#renderMessage = fn
	}

	get name() {
		return this.slashCommand.name
	}

	registerParam<
		Name extends string,
		Type extends any,
		Required extends boolean,
	>({
		name,
		description,
		type,
		required,
	}: CommandParamOptions<Required> & {
		name: Name
		description: string
	}): Omit<
		ChatInputCommand<
			Props & {
				[k in Name]: Required extends true ? Type : Type | undefined
			}
		>,
		"addSubcommand" | "addSubcommandGroup"
	> {
		this.#params.push(name)

		this.slashCommand.options ??= []

		// @ts-expect-error wrong type?
		this.slashCommand.options.push({
			name,
			description,
			type,
			required: required ?? false,
		})

		return this
	}

	boolParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, boolean, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Boolean,
			...options,
		})
	}

	channelParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, GuildBasedChannel, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Channel,
			...options,
		})
	}

	intParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, number, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Integer,
			...options,
		})
	}

	mentionParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, GuildMember | Role | User, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Mentionable,
			...options,
		})
	}

	numberParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, number, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Number,
			...options,
		})
	}

	roleParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, Role, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.Role,
			...options,
		})
	}

	stringParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, string, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.String,
			...options,
		})
	}

	userParam<Name extends string, Required extends boolean>(
		name: Name,
		description: string,
		options: Omit<CommandParamOptions<Required>, "type"> = {},
	) {
		return this.registerParam<Name, User, Required>({
			name,
			description,
			type: ApplicationCommandOptionType.User,
			...options,
		})
	}

	render(
		callback: CommandInteractionCallback<
			Props,
			CommandInteraction,
			JSX.Element
		>,
	) {
		this.#interactionCallback = (props, interaction) => {
			if (!this.#renderMessage)
				throw new Error("Command wasn't registered correctly")
			this.#renderMessage(this.#messageResponseOptions)(interaction, () =>
				callback(props, interaction),
			)
		}
		return this
	}

	exec(
		callback: CommandInteractionCallback<Props, CommandInteraction, void>,
	) {
		this.#interactionCallback = callback
		return this
	}

	replyToInteraction(interaction: CommandInteraction) {
		const { options } = interaction

		const props = Object.fromEntries(
			this.#params.map((name) => [
				name,
				options.get(name)?.value ?? undefined,
			]),
		) as Props

		this.#interactionCallback?.(props, interaction)
	}
}

abstract class ContextMenuCommand<
	DataType extends
		| MessageApplicationCommandData
		| UserApplicationCommandData = any,
	InteractionType extends DataType extends MessageApplicationCommandData
		? MessageContextMenuCommandInteraction
		: UserContextMenuCommandInteraction = any,
	Props extends DataType extends MessageApplicationCommandData
		? Message
		: User = any,
> {
	#renderMessage?: (
		messageResponseOptions?: MessageResponseOptions,
	) => RenderMessageFn
	data: DataType
	interactionCallback?: CommandInteractionCallback<
		Props,
		InteractionType,
		void
	>
	#messageResponseOptions: MessageResponseOptions = {}

	constructor(
		name: string,
		type: DataType["type"],
		defaultPermission?: boolean,
		messageResponseOptions?: MessageResponseOptions,
	) {
		//@ts-expect-error
		this.data = {
			name,
			defaultPermission,
			type,
		}
		this.#messageResponseOptions = {
			...this.#messageResponseOptions,
			...messageResponseOptions,
		}
	}

	setRenderMessageFn(
		fn: (
			messageResponseOptions?: MessageResponseOptions,
		) => RenderMessageFn,
	): void {
		this.#renderMessage = fn
	}

	render(
		callback: CommandInteractionCallback<
			Props,
			InteractionType,
			JSX.Element
		>,
	) {
		this.interactionCallback = (props, interaction) => {
			if (!this.#renderMessage)
				throw new Error("Command wasn't registered correctly")
			this.#renderMessage(this.#messageResponseOptions)(interaction, () =>
				callback(props, interaction),
			)
		}
		return this
	}

	exec(callback: CommandInteractionCallback<Props, InteractionType, void>) {
		this.interactionCallback = callback
		return this
	}

	abstract replyToInteraction(interaction: InteractionType): void
}

export class MessageContextCommand extends ContextMenuCommand<
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	Message
> {
	constructor(name: string, defaultPermission?: boolean | undefined) {
		super(name, ApplicationCommandType.Message, defaultPermission)
	}

	replyToInteraction(
		interaction: MessageContextMenuCommandInteraction,
	): void {
		if (!(interaction.targetMessage instanceof Message)) {
			throw new Error("Unhandled interaction target message type")
		}
		this.interactionCallback?.(interaction.targetMessage, interaction)
	}
}

export class UserContextCommand extends ContextMenuCommand<
	UserApplicationCommandData,
	UserContextMenuCommandInteraction,
	User
> {
	constructor(name: string, defaultPermission?: boolean | undefined) {
		super(name, ApplicationCommandType.User, defaultPermission)
	}

	replyToInteraction(interaction: UserContextMenuCommandInteraction): void {
		if (!(interaction.targetUser instanceof User)) {
			throw new Error("Unhandled interaction target user type")
		}
		this.interactionCallback?.(interaction.targetUser, interaction)
	}
}
