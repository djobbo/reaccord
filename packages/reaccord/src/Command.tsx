import { ApplicationCommandOptionType } from "discord.js"
import { EMPTY_STRING } from "@reaccord/core/src/helpers/constants"
import { SlashCommandBuilder } from "@discordjs/builders"
import type { ChatInputCommandInteraction } from "discord.js"
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

export class Command<
    Props extends { [k in string]: any } = {},
> extends SlashCommandBuilder {
    #renderMessage: RenderMessageFn
    #params: [name: string, type: ApplicationCommandOptionType][]
    #interactionCallback?: CommandInteractionCallback<Props, void>

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
        super()
        this.setName(name)
        this.setDescription(description ?? EMPTY_STRING)

        this.#renderMessage = renderMessage
        this.#params = []
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

        switch (type) {
            case ApplicationCommandOptionType.String:
                return this.addStringOption((option) =>
                    option
                        .setName(name)
                        .setDescription(description)
                        .setRequired(required ?? false),
                )
            case ApplicationCommandOptionType.Number:
                return this.addNumberOption((option) =>
                    option
                        .setName(name)
                        .setDescription(description)
                        .setRequired(required ?? false),
                )
            default:
                throw new Error(`Invalid slash command option type ${type}`)
        }
    }

    stringParam<Name extends string, Required extends boolean>(
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

    numberParam<Name extends string, Required extends boolean>(
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

    render(Code: CommandInteractionCallback<Props, JSX.Element>): void {
        this.#interactionCallback = (props, interaction) => {
            this.#renderMessage(interaction, () => <Code {...props} />)
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
                    case ApplicationCommandOptionType.String:
                        return [name, options.getString(name)]
                    case ApplicationCommandOptionType.Number:
                        return [name, options.getNumber(name)]
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
