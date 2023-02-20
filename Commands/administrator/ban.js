const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)  //only administrator
    .addUserOption(option=>
        option.setName("user")
            .setDescription("Người bạn muốn ban")
            .setRequired(true)
        )
    .addStringOption(option=>
        option.setName("reason")
            .setDescription("Lí do ban") 
            .setRequired(true) 
    ),
    execute(interaction,client){
        
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "Không lí do";
        
        
        if(user.id === interaction.user.id) return interaction.reply({content:"❌ Bạn không thể ban chính mình!", ephemeral: true});  

        
        if (user.id === client.user.id) return interaction.reply({
            content: "Bạn không thể dùng lệnh của tui đâu! 😜",
        });
        if(user.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({
                content: `Bạn không thể ban thành viên này vì role của họ cao hơn!`,});
        
        if(!user.bannable) return interaction.reply({
            content: "Xin lỗi, tui không thể ban thành viên này"
        });
        interaction.reply({
            content: `✅| Đã ban <@${user.id}>| Lí do: ${reason}`
        });
        user.send({
            content: `Bạn đã bị ban khỏi **${interaction.guild.name}**`
        }).catch(()=>{});;
        user.ban({reason: reason}).catch(()=>{})
    }
}

