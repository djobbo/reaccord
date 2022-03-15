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

createCommand("setrole", "Add role to a user")
    .addMention("user", "User", { required: true })
    .addRole("role", "Role", { required: true })
    .exec(({ user, role }, interaction) => {
        if (!(user instanceof GuildMember))
            return interaction.reply({
                content: "Failed to add role",
                ephemeral: true,
            })
        user.roles.add(role)
        interaction.reply({ content: "done!", ephemeral: true })
    })

connect((client) =>
    console.log(`🚀 Client connected as ${client.user?.username}!`),
)
