import { ApplicationCommandOptionType } from "discord.js"
import { EMPTY_STRING } from "@reaccord/core/src/helpers/constants"
import { SlashCommandBuilder } from "@discordjs/builders"
import type {
    ChatInputCommandInteraction,
    GuildBasedChannel,
    GuildMember,
    Role,
    User,
} from "discord.js"
import type { JSX } from "@reaccord/core/jsx-runtime"
import type { RenderMessageFn } from "@reaccord/core/lib/renderer/renderMessage"

type CommandParamOptions<Required extends boolean = false> = {
    type: ApplicationCommandOptionType
    required?: Required
}

type CommandInteractionCallback<Props, ReturnValue> = (
    props: Props,
    interaction: ChatInputCommandInteraction,
) => ReturnValue

export class Command<Props extends { [k in string]: any } = {}> {
    #renderMessage: RenderMessageFn
    #params: [name: string, type: ApplicationCommandOptionType][]
    #interactionCallback?: CommandInteractionCallback<Props, void>
    slashCommand: SlashCommandBuilder

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
        this.slashCommand = new SlashCommandBuilder()
        this.slashCommand.setName(name)
        this.slashCommand.setDescription(description ?? EMPTY_STRING)

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

        const addOption = (option: any) =>
            option
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false)

        switch (type) {
            case ApplicationCommandOptionType.Boolean:
                this.slashCommand.addBooleanOption(addOption)
                break
            case ApplicationCommandOptionType.Channel:
                this.slashCommand.addChannelOption(addOption)
                break
            case ApplicationCommandOptionType.Integer:
                this.slashCommand.addIntegerOption(addOption)
                break
            case ApplicationCommandOptionType.Mentionable:
                this.slashCommand.addMentionableOption(addOption)
                break
            case ApplicationCommandOptionType.Number:
                this.slashCommand.addNumberOption(addOption)
                break
            case ApplicationCommandOptionType.Role:
                this.slashCommand.addRoleOption(addOption)
                break
            case ApplicationCommandOptionType.String:
                this.slashCommand.addStringOption(addOption)
                break
            case ApplicationCommandOptionType.User:
                this.slashCommand.addUserOption(addOption)
                break
            default:
                throw new Error(`Invalid slash command option type ${type}`)
        }
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
            type: ApplicationCommandOptionType.Boolean,
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
            type: ApplicationCommandOptionType.Boolean,
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
            type: ApplicationCommandOptionType.Integer,
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
            type: ApplicationCommandOptionType.Mentionable,
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
            type: ApplicationCommandOptionType.Number,
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
            type: ApplicationCommandOptionType.Role,
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
            type: ApplicationCommandOptionType.String,
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
            type: ApplicationCommandOptionType.User,
            ...options,
        })
    }

    render(callback: CommandInteractionCallback<Props, JSX.Element>): void {
        this.#interactionCallback = (props, interaction) => {
            this.#renderMessage(interaction, () => callback(props, interaction))
        }
    }

    exec(callback: CommandInteractionCallback<Props, void>): void {
        this.#interactionCallback = callback
    }

    replyToInteraction(interaction: ChatInputCommandInteraction) {
        const { options } = interaction

        const props = Object.fromEntries(
            this.#params.map(([name, type]) => {
                switch (type) {
                    case ApplicationCommandOptionType.Boolean:
                        return [name, options.getBoolean(name)]
                    case ApplicationCommandOptionType.Channel:
                        return [name, options.getChannel(name)]
                    case ApplicationCommandOptionType.Integer:
                        return [name, options.getInteger(name)]
                    case ApplicationCommandOptionType.Mentionable:
                        return [name, options.getMentionable(name)]
                    case ApplicationCommandOptionType.Number:
                        return [name, options.getNumber(name)]
                    case ApplicationCommandOptionType.Role:
                        return [name, options.getRole(name)]
                    case ApplicationCommandOptionType.String:
                        return [name, options.getString(name)]
                    case ApplicationCommandOptionType.User:
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
