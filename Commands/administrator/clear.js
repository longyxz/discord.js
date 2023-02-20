const { PermissionFlagsBits, EmbedBuilder, SlashCommandBuilder} = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("xóa tin trong kênh")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option =>
        option.setName("amount")
            .setDescription("Số lượng tin nhắn cần xóa")
            .setMinValue(1).setMaxValue(100)
            .setRequired(true)
    ),
    async execute(interaction, client){
        const amount = interaction.options.getInteger("amount");
        const channel = interaction.channel;

        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({content: "Bạn không có quyền sử dụng lệnh này", ephemeral: true});
        if(!amount) return await interaction.reply({content: "Vui lòng nhập số lượng!"});
        if(amount >100 || amount <1) return await interaction.reply({content: "Vui lòng chọn số lường từ 1 đến 100"})
        
        await interaction.channel.bulkDelete(amount).catch(err =>{
            return; 
        });
        
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅: Đã xóa **${amount}** tin nhắn`);

        await interaction.reply({embeds : [embed]}).catch(err=>{
            return;
        })
        setTimeout(()=>{interaction.deleteReply()}, 2000)
    }
}