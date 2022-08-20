import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Message,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
  User,
} from "discord.js"
import { EMPTY_STRING } from "./helpers/constants"
import type {
  ApplicationCommandOptionChoiceData,
  Channel,
  CommandInteraction,
  GuildMember,
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
  Role,
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
} from "discord.js"
import type { MessageResponseOptions } from "./nodes/Root"
import type { RenderMessageFn } from "./renderer/render"

type CommandOptionChoiceData<
  ChoiceType extends string | number | never = never,
> = Omit<ApplicationCommandOptionChoiceData, "value"> & {
  value: ChoiceType
}

type CommandParamOptions<
  Required extends boolean = false,
  ChoiceType extends string | number | never = never,
> = {
  type: ApplicationCommandOptionType
  required?: Required
  choices?: CommandOptionChoiceData<ChoiceType>[]
}

type CommandInteractionCallback<Props, InteractionType, ReturnValue> = (
  props: Props,
  interaction: InteractionType,
) => ReturnValue

class CommandBase {
  renderMessage?: (
    messageResponseOptions?: MessageResponseOptions,
  ) => RenderMessageFn

  constructor() {}

  setRenderMessageFn(
    fn: (messageResponseOptions?: MessageResponseOptions) => RenderMessageFn,
  ): void {
    this.renderMessage = fn
  }
}

export class ChatInputCommand<
  Props extends { [k in string]: any } = {},
> extends CommandBase {
  #params: string[]
  #interactionCallback?: CommandInteractionCallback<
    Props,
    CommandInteraction,
    void
  >
  commandData: SlashCommandBuilder
  #messageResponseOptions: MessageResponseOptions = {}

  constructor(
    name: string,
    description: string,
    messageResponseOptions?: MessageResponseOptions,
  ) {
    super()

    this.commandData = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description ?? EMPTY_STRING)

    this.#params = []
    this.#messageResponseOptions = {
      ...this.#messageResponseOptions,
      ...messageResponseOptions,
    }
  }

  get name() {
    return this.commandData.name
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
    choices,
  }: CommandParamOptions<Required, string | number | never> & {
    name: Name
    type: ApplicationCommandOptionType
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

    switch (type) {
      case ApplicationCommandOptionType.Attachment:
        this.commandData.addAttachmentOption(
          new SlashCommandAttachmentOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
        break
      case ApplicationCommandOptionType.Boolean:
        this.commandData.addBooleanOption(
          new SlashCommandBooleanOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
        break
      case ApplicationCommandOptionType.Channel:
        this.commandData.addChannelOption(
          new SlashCommandChannelOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
        break
      case ApplicationCommandOptionType.Integer: {
        const option = new SlashCommandIntegerOption()
          .setName(name)
          .setDescription(description)
          .setRequired(required ?? false)

        if (choices) {
          option.setChoices(...(choices as CommandOptionChoiceData<number>[]))
        }

        this.commandData.addIntegerOption(option)
        break
      }
      case ApplicationCommandOptionType.Mentionable:
        this.commandData.addMentionableOption(
          new SlashCommandMentionableOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
        break
      case ApplicationCommandOptionType.Number: {
        const option = new SlashCommandNumberOption()
          .setName(name)
          .setDescription(description)
          .setRequired(required ?? false)

        if (choices) {
          option.setChoices(...(choices as CommandOptionChoiceData<number>[]))
        }

        this.commandData.addNumberOption(option)
        break
      }
      case ApplicationCommandOptionType.Role:
        this.commandData.addRoleOption(
          new SlashCommandRoleOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
        break
      case ApplicationCommandOptionType.String: {
        const option = new SlashCommandStringOption()
          .setName(name)
          .setDescription(description)
          .setRequired(required ?? false)

        if (choices) {
          option.setChoices(...(choices as CommandOptionChoiceData<string>[]))
        }

        this.commandData.addStringOption(option)
        break
      }
      case ApplicationCommandOptionType.User:
        this.commandData.addUserOption(
          new SlashCommandUserOption()
            .setName(name)
            .setDescription(description)
            .setRequired(required ?? false),
        )
      default:
        throw new Error(`Unknown option type: ${type}`)
    }

    return this
  }

  boolParam<Name extends string, Required extends boolean>(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required>, "type" | "choices"> = {},
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
    options: Omit<CommandParamOptions<Required>, "type" | "choices"> = {},
  ) {
    return this.registerParam<Name, Channel, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.Channel,
      ...options,
    })
  }

  intParam<
    Name extends string,
    Required extends boolean,
    ChoicesType extends number,
  >(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required, ChoicesType>, "type"> = {},
  ) {
    return this.registerParam<Name, ChoicesType, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.Integer,
      ...options,
    })
  }

  mentionParam<Name extends string, Required extends boolean>(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required>, "type" | "choices"> = {},
  ) {
    return this.registerParam<Name, GuildMember | Role | User, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.Mentionable,
      ...options,
    })
  }

  numberParam<
    Name extends string,
    Required extends boolean,
    ChoicesType extends number,
  >(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required, ChoicesType>, "type"> = {},
  ) {
    return this.registerParam<Name, ChoicesType, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.Number,
      ...options,
    })
  }

  roleParam<Name extends string, Required extends boolean>(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required>, "type" | "choices"> = {},
  ) {
    return this.registerParam<Name, Role, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.Role,
      ...options,
    })
  }

  stringParam<
    Name extends string,
    Required extends boolean,
    ChoicesType extends string,
  >(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required, ChoicesType>, "type"> = {},
  ) {
    return this.registerParam<Name, ChoicesType, Required>({
      name,
      description,
      type: ApplicationCommandOptionType.String,
      ...options,
    })
  }

  userParam<Name extends string, Required extends boolean>(
    name: Name,
    description: string,
    options: Omit<CommandParamOptions<Required>, "type" | "choices"> = {},
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
      if (!this.renderMessage)
        throw new Error("Command wasn't registered correctly")
      this.renderMessage(this.#messageResponseOptions)(interaction, () =>
        callback(props, interaction),
      )
    }
    return this
  }

  exec(callback: CommandInteractionCallback<Props, CommandInteraction, void>) {
    this.#interactionCallback = callback
    return this
  }

  replyToInteraction(interaction: CommandInteraction) {
    const { options } = interaction

    const props = Object.fromEntries(
      this.#params.map((name) => [name, options.get(name)?.value ?? undefined]),
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
> extends CommandBase {
  commandData: DataType
  interactionCallback?: CommandInteractionCallback<Props, InteractionType, void>
  #messageResponseOptions: MessageResponseOptions = {}

  constructor(
    name: string,
    type: DataType["type"],
    defaultPermission?: boolean,
    messageResponseOptions?: MessageResponseOptions,
  ) {
    super()

    //@ts-expect-error
    this.commandData = {
      name,
      defaultPermission,
      type,
    }
    this.#messageResponseOptions = {
      ...this.#messageResponseOptions,
      ...messageResponseOptions,
    }
  }

  render(
    callback: CommandInteractionCallback<Props, InteractionType, JSX.Element>,
  ) {
    this.interactionCallback = (props, interaction) => {
      if (!this.renderMessage)
        throw new Error("Command wasn't registered correctly")
      this.renderMessage(this.#messageResponseOptions)(interaction, () =>
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

  replyToInteraction(interaction: MessageContextMenuCommandInteraction): void {
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
