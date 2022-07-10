import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums"
import { Message, User } from "discord.js"
import type {
    ChatInputApplicationCommandData,
    CommandInteraction,
    GuildBasedChannel,
    GuildMember,
    MessageApplicationCommandData,
    MessageContextMenuInteraction,
    Role,
    UserApplicationCommandData,
    UserContextMenuInteraction,
} from "discord.js"
import type { JSX } from "../jsx-runtime"
import type { RenderMessageFn } from "./renderer/renderMessage"

type CommandParamOptions<Required extends boolean = false> = {
    type: ApplicationCommandOptionTypes
    required?: Required
}

type CommandInteractionCallback<Props, InteractionType, ReturnValue> = (
    props: Props,
    interaction: InteractionType,
) => ReturnValue

export class ChatInputCommand<Props extends { [k in string]: any } = {}> {
    #renderMessage?: RenderMessageFn
    #params: [name: string, type: ApplicationCommandOptionTypes][]
    #interactionCallback?: CommandInteractionCallback<
        Props,
        CommandInteraction,
        void
    >
    slashCommand: ChatInputApplicationCommandData

    constructor(name: string, description: string) {
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
    }

    setRenderMessageFn(fn: RenderMessageFn): void {
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
        this.#params.push([name, type])

        if (!this.slashCommand.options) {
            this.slashCommand.options = []
        }

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
            type: ApplicationCommandOptionTypes.BOOLEAN,
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
            type: ApplicationCommandOptionTypes.CHANNEL,
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
            type: ApplicationCommandOptionTypes.INTEGER,
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
            type: ApplicationCommandOptionTypes.MENTIONABLE,
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
            type: ApplicationCommandOptionTypes.NUMBER,
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
            type: ApplicationCommandOptionTypes.ROLE,
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
            type: ApplicationCommandOptionTypes.STRING,
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
            type: ApplicationCommandOptionTypes.USER,
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
            this.#renderMessage(interaction, () => callback(props, interaction))
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
            this.#params.map(([name, type]) => {
                switch (type) {
                    case ApplicationCommandOptionTypes.BOOLEAN:
                        return [name, options.getBoolean(name) ?? undefined]
                    case ApplicationCommandOptionTypes.CHANNEL:
                        return [name, options.getChannel(name) ?? undefined]
                    case ApplicationCommandOptionTypes.INTEGER:
                        return [name, options.getInteger(name) ?? undefined]
                    case ApplicationCommandOptionTypes.MENTIONABLE:
                        return [name, options.getMentionable(name) ?? undefined]
                    case ApplicationCommandOptionTypes.NUMBER:
                        return [name, options.getNumber(name) ?? undefined]
                    case ApplicationCommandOptionTypes.ROLE:
                        return [name, options.getRole(name) ?? undefined]
                    case ApplicationCommandOptionTypes.STRING:
                        return [name, options.getString(name) ?? undefined]
                    case ApplicationCommandOptionTypes.USER:
                        return [name, options.getUser(name) ?? undefined]
                    default:
                        throw new Error(
                            `Invalid slash command option type ${type}`,
                        )
                }
            }),
        ) as Props

        this.#interactionCallback?.(props, interaction)
    }
}

abstract class ContextMenuCommand<
    DataType extends
        | MessageApplicationCommandData
        | UserApplicationCommandData = any,
    InteractionType extends DataType extends MessageApplicationCommandData
        ? MessageContextMenuInteraction
        : UserContextMenuInteraction = any,
    Props extends DataType extends MessageApplicationCommandData
        ? Message
        : User = any,
> {
    #renderMessage?: RenderMessageFn
    data: DataType
    interactionCallback?: CommandInteractionCallback<
        Props,
        InteractionType,
        void
    >

    constructor(
        name: string,
        type: DataType["type"],
        defaultPermission?: boolean,
    ) {
        //@ts-expect-error
        this.data = {
            name,
            defaultPermission,
            type,
        }
    }

    setRenderMessageFn(fn: RenderMessageFn): void {
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
            this.#renderMessage(interaction, () => callback(props, interaction))
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
    MessageContextMenuInteraction,
    Message
> {
    constructor(name: string, defaultPermission?: boolean | undefined) {
        super(name, ApplicationCommandTypes.MESSAGE, defaultPermission)
    }

    replyToInteraction(interaction: MessageContextMenuInteraction): void {
        if (!(interaction.targetMessage instanceof Message)) {
            throw new Error("Unhandled interaction target message type")
        }
        this.interactionCallback?.(interaction.targetMessage, interaction)
    }
}

export class UserContextCommand extends ContextMenuCommand<
    UserApplicationCommandData,
    UserContextMenuInteraction,
    User
> {
    constructor(name: string, defaultPermission?: boolean | undefined) {
        super(name, ApplicationCommandTypes.USER, defaultPermission)
    }

    replyToInteraction(interaction: UserContextMenuInteraction): void {
        if (!(interaction.targetUser instanceof User)) {
            throw new Error("Unhandled interaction target user type")
        }
        this.interactionCallback?.(interaction.targetUser, interaction)
    }
}
