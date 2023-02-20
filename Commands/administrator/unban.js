const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');


module.exports ={
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unban 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option=>
        option.setName("userid")
            .setDescription("Id thành viên bị ban")
            .setRequired(true)
    ),
    async execute(interaction, client){
        const userId = interaction.options.getString("userid");

        try{
            await interaction.guild.members.unban(userId);
            await interaction.reply({content: `✅ Đã gỡ ban thành công cho <@${userId}>`}); 
        } catch(err){
            console.log(err);
            interaction.reply({content: "Vui lòng nhập chính xác id thành viên"})
        }

    }

}