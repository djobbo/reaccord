import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums"
import { EMPTY_STRING } from "./helpers/constants"
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

export class Command<Props extends { [k in string]: any } = {}> {
    #renderMessage: RenderMessageFn
    #params: [name: string, type: ApplicationCommandOptionTypes][]
    #interactionCallback?: CommandInteractionCallback<
        Props,
        CommandInteraction,
        void
    >
    slashCommand: ChatInputApplicationCommandData

    constructor(
        renderMessage: RenderMessageFn,
        {
            name,
            description,
        }: {
            name: string
            description?: string
        },
    ) {
        // TODO: check for builder in a later update
        // this.slashCommand = new SlashCommandBuilder()
        // this.slashCommand.setName(name)
        // this.slashCommand.setDescription(description ?? EMPTY_STRING)

        this.slashCommand = {
            name,
            description: description ?? EMPTY_STRING,
            options: [],
        }

        this.#renderMessage = renderMessage
        this.#params = []
    }

    get name() {
        return this.slashCommand.name
    }

    addParam<Name extends string, Type extends any, Required extends boolean>({
        name,
        description,
        type,
        required,
    }: CommandParamOptions<Required> & {
        name: Name
        description: string
    }): Omit<
        Command<
            Props & {
                [k in Name]: Required extends true ? Type : Type | null
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

    addBool<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, boolean, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.BOOLEAN,
            ...options,
        })
    }

    addChannel<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, GuildBasedChannel, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.CHANNEL,
            ...options,
        })
    }

    addInt<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, number, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.INTEGER,
            ...options,
        })
    }

    addMention<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, GuildMember | Role | User, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.MENTIONABLE,
            ...options,
        })
    }

    addNumber<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, number, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.NUMBER,
            ...options,
        })
    }

    addRole<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, Role, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.ROLE,
            ...options,
        })
    }

    addString<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, string, Required>({
            name,
            description,
            type: ApplicationCommandOptionTypes.STRING,
            ...options,
        })
    }

    addUser<Name extends string, Required extends boolean>(
        name: Name,
        description: string,
        options: Omit<CommandParamOptions<Required>, "type"> = {},
    ) {
        return this.addParam<Name, User, Required>({
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
    ): void {
        this.#interactionCallback = (props, interaction) => {
            this.#renderMessage(interaction, () => callback(props, interaction))
        }
    }

    exec(
        callback: CommandInteractionCallback<Props, CommandInteraction, void>,
    ): void {
        this.#interactionCallback = callback
    }

    replyToInteraction(interaction: CommandInteraction) {
        const { options } = interaction

        const props = Object.fromEntries(
            this.#params.map(([name, type]) => {
                switch (type) {
                    case ApplicationCommandOptionTypes.BOOLEAN:
                        return [name, options.getBoolean(name)]
                    case ApplicationCommandOptionTypes.CHANNEL:
                        return [name, options.getChannel(name)]
                    case ApplicationCommandOptionTypes.INTEGER:
                        return [name, options.getInteger(name)]
                    case ApplicationCommandOptionTypes.MENTIONABLE:
                        return [name, options.getMentionable(name)]
                    case ApplicationCommandOptionTypes.NUMBER:
                        return [name, options.getNumber(name)]
                    case ApplicationCommandOptionTypes.ROLE:
                        return [name, options.getRole(name)]
                    case ApplicationCommandOptionTypes.STRING:
                        return [name, options.getString(name)]
                    case ApplicationCommandOptionTypes.USER:
                        return [name, options.getUser(name)]
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
    #renderMessage: RenderMessageFn
    data: DataType
    interactionCallback?: CommandInteractionCallback<
        Props,
        InteractionType,
        void
    >

    constructor(
        renderMessage: RenderMessageFn,
        name: string,
        type: DataType["type"],
        defaultPermission?: boolean,
    ) {
        this.#renderMessage = renderMessage
        //@ts-expect-error
        this.data = {
            name,
            defaultPermission,
            type,
        }
    }

    render(
        callback: CommandInteractionCallback<
            Props,
            InteractionType,
            JSX.Element
        >,
    ) {
        this.interactionCallback = (props, interaction) => {
            this.#renderMessage(interaction, () => callback(props, interaction))
        }
    }

    exec(
        callback: CommandInteractionCallback<Props, InteractionType, void>,
    ): void {
        this.interactionCallback = callback
    }

    abstract replyToInteraction(interaction: InteractionType): void
}

export class MessageContextCommand extends ContextMenuCommand<
    MessageApplicationCommandData,
    MessageContextMenuInteraction,
    Message
> {
    constructor(
        renderMessage: RenderMessageFn,
        name: string,
        defaultPermission?: boolean | undefined,
    ) {
        super(
            renderMessage,
            name,
            ApplicationCommandTypes.MESSAGE,
            defaultPermission,
        )
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
    constructor(
        renderMessage: RenderMessageFn,
        name: string,
        defaultPermission?: boolean | undefined,
    ) {
        super(
            renderMessage,
            name,
            ApplicationCommandTypes.USER,
            defaultPermission,
        )
    }

    replyToInteraction(interaction: UserContextMenuInteraction): void {
        if (!(interaction.targetUser instanceof User)) {
            throw new Error("Unhandled interaction target user type")
        }
        this.interactionCallback?.(interaction.targetUser, interaction)
    }
}
