import { ApplicationCommandOptionType, Client } from "discord.js"
import { EMPTY_STRING } from "@reaccord/core/src/helpers/constants"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { SlashCommandBuilder } from "@discordjs/builders"
import { createRenderer } from "@reaccord/core"
import type { ChatInputCommandInteraction, ClientOptions } from "discord.js"
import type { JSX } from "@reaccord/core/jsx-runtime"
import type { RenderMessageFn } from "@reaccord/core/lib/renderer/renderMessage"

const DEV = process.env.NODE_ENV !== "production"

type CommandParamOptions<Required extends boolean = false> = {
    type: ApplicationCommandOptionType
    required?: Required
}

type CommandInteractionCallback<Props, ReturnValue> = (
    props: Props,
    interaction: ChatInputCommandInteraction,
) => ReturnValue

class Command<
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

const refreshCommands = async (
    token: string,
    commands: Command[],
    clientId?: string,
    devGuildId?: string,
) => {
    const rest = new REST({ version: "9" }).setToken(token)
    if (!clientId)
        throw new Error(
            "Can't create slash command. No `clientId` was provided.",
        )
    try {
        console.log("✨ Started refreshing application (/) commands.")

        if (DEV) {
            if (!devGuildId)
                throw new Error(
                    "Couldn't refresh slash commands in dev mode, `devServerId` option was not provided.",
                )
            await rest.put(
                Routes.applicationGuildCommands(clientId, devGuildId),
                { body: commands },
            )
        } else {
            await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            })
        }

        console.log("🙌 Successfully reloaded application (/) commands.")
    } catch (error) {
        console.error(error)
    }
}

export const createClient = ({
    token,
    devGuildId: devGuildId,
    clientId,
    ...options
}: ClientOptions & {
    token: string
    devGuildId?: string
    clientId?: string
}) => {
    const client = new Client(options)

    const { renderMessage } = createRenderer(client)

    let commands: Command[] = []

    const connect = async (callback: (client: Client) => void) => {
        client.on("ready", callback)
        await refreshCommands(token, commands, clientId, devGuildId)
        await client.login(token)
    }

    client.on("interactionCreate", (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.find((c) => c.name === interaction.commandName)
        if (!command) return

        command.replyToInteraction(interaction)
    })

    const createCommand = (name: string, description: string) => {
        const command = new Command(renderMessage, { name, description })
        commands.push(command)
        return command
    }

    return {
        client,
        connect,
        renderMessage,
        refreshCommands,
        createCommand,
    }
}

export * from "@reaccord/core"
export * from "@reaccord/router"
