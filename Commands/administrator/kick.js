const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) //only administrator
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên để kick")
            .setRequired(true)
        )
    .addStringOption(option=>
        option.setName("reason")
            .setDescription("Lí do bị kick")
            .setRequired(true)  
    ),
    execute(interaction,client){
        
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason";
        
        
        if(user.id === interaction.user.id) return interaction.reply({content:"❌ Bạn không thể kick chính mình!", ephemeral: true});  

        
        if (user.id === client.user.id) return interaction.reply({
            content: "Bạn không thể dùng lệnh của tui đâu! 😜",
        });
        if(user.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({
                content: `Bạn không thể kick thành viên này vì role của họ cao hơn`,});
        
        if(!user.kickable) return interaction.reply({
            content: "Xin lỗi, tui không thể kick thành viên này!"
        });
        interaction.reply({
            content: `✅| Đã kick <@${user.id}>| Lí do: ${reason}`
        });
        user.send({
            content: `Bạn đã bị kick khỏi **${interaction.guild.name}**`
        }).catch(()=>{});;
        user.kick(reason).catch(()=>{})
    }
}

