import {
    ChatInputCommand,
    Client,
    GuildMember,
    MessageContextCommand,
    UserContextCommand,
} from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const client = new Client({
    token: DISCORD_TOKEN ?? "",
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

const avatarCmd = new ChatInputCommand("avatar", "Get user avatar")
    .userParam("user", "user", { required: true })
    .render(({ user }, interaction) => {
        const avatarUrl = user.avatarURL({ size: 1024 })

        if (!avatarUrl)
            return (
                <embed>
                    <color color="ORANGE" />
                    <title>Avatar not found</title>
                </embed>
            )

        return (
            <embed>
                <color color="BLUE" />
                <author
                    name={interaction.user.username}
                    iconURL={interaction.user.avatarURL() ?? undefined}
                >
                    {user.username}
                    {`'`}s avatar
                </author>
                <footer>Requested by {interaction.user.username}</footer>
                <img src={avatarUrl} />
            </embed>
        )
    })

const nickCmd = new ChatInputCommand("nick", "Set a user's nickname")
    .mentionParam("user", "User")
    .stringParam("nick", "Nickname")
    .exec(async ({ user, nick }, interaction) => {
        const member = user ?? interaction.member
        if (!(member instanceof GuildMember))
            return await interaction.reply({
                content: "Failed to add role",
                ephemeral: true,
            })
        try {
            await member.setNickname(nick ?? "")
            await interaction.reply({
                content: `${member.user.username}'s nickname was ${
                    nick ? `changed to ${nick}` : "reset"
                }!`,
                ephemeral: true,
            })
        } catch {
            await interaction.reply({
                content: `${member.user.username}'s nickname could not be changed.`,
                ephemeral: true,
            })
        }
    })

const msgCtxHelloCmd = new MessageContextCommand("hello").render((msg) => (
    <content>Message Id: {msg.id}</content>
))

const userCtxAvatarCmd = new UserContextCommand("avatar").render(
    (user, interaction) => (
        <embed>
            <color color="BLUE" />
            <author
                name={user.username}
                iconURL={
                    user.avatarURL({ size: 1024 }) ?? user.defaultAvatarURL
                }
            >
                {user.username}
                {`'`}s avatar
            </author>
            <img
                src={user.avatarURL({ size: 1024 }) ?? user.defaultAvatarURL}
            />
            <footer
                iconURL={
                    interaction.user.avatarURL() ??
                    interaction.user.defaultAvatarURL
                }
            >
                Requested by {interaction.user.username}
            </footer>
        </embed>
    ),
)

client.registerCommand(avatarCmd)
client.registerCommand(nickCmd)
client.registerCommand(msgCtxHelloCmd)
client.registerCommand(userCtxAvatarCmd)

client.connect(() =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
