import { GuildMember } from "discord.js"
import { createClient } from "reaccord"
import { config as loadEnv } from "dotenv"

loadEnv()

const { DISCORD_TOKEN, DISCORD_DEV_GUILD_ID, DISCORD_CLIENT_ID } = process.env

const { connect, createCommand } = createClient({
    token: DISCORD_TOKEN ?? "",
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    devGuildId: DISCORD_DEV_GUILD_ID,
    clientId: DISCORD_CLIENT_ID,
})

createCommand("avatar", "Get user avatar")
    .addUser("user", "user", { required: true })
    .render(({ user }, interaction) => {
        const avatarUrl = user.avatarURL({ size: 1024 })

        if (!avatarUrl)
            return (
                <embed>
                    <color color="Orange" />
                    <title>Avatar not found</title>
                </embed>
            )

        return (
            <embed>
                <color color="Blue" />
                <author
                    name={interaction.user.username}
                    iconURL={interaction.user.avatarURL() ?? undefined}
                >
                    {user.username}
                    {`'`}s avatar
                </author>
                <img src={avatarUrl} />
            </embed>
        )
    })

createCommand("nick", "Set a user's nickname")
    .addMention("user", "User")
    .addString("nick", "Nickname")
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

connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
