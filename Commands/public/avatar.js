const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Xem avatar")
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn người dùng")
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user} = interaction;
        const target = options.getUser("user")

        const avtEmbed = new EmbedBuilder()
        .setTitle(`${target.username}'s avatar`)
        .setImage(`${target.displayAvatarURL({format: 'png', size: 4096, dynamic: true})}`)
        .setFooter({text: `Request by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        .setColor("White");


        await interaction.reply({embeds: [avtEmbed]});
    }
};
