const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("removevip")
    .setDescription("Xóa VIP của 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)  
    .addUserOption(option=>
        option.setName("user")
            .setDescription("Chọn 1 thành viên")
            .setRequired(true)
    ),
    
    async execute(interaction){
        const {options, user, guild} = interaction;
        const member = options.getUser("user")
        
        
        let userdata =  await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!userdata) return interaction.reply({content: "❌ Thành viên này không có tài khoản economy!!!", ephemeral: true});
        if(interaction.user.id != '878943225308672050') return interaction.reply({content: "lệnh này chỉ dành cho nhà phát triển!!!", ephemeral: true})

       if(userdata.Vip == false) return interaction.reply({content:"❌ Thành viên này không có ***Vip***", ephemeral: true})
       if(userdata.Vip == true){
        userdata.Vip = false;
        userdata.save()

        const embed = new EmbedBuilder()
        .setTitle("Xóa Vip Thành Công")
        .setDescription(`Bạn đã xóa ***Vip*** của ${member}`)
        .setColor("Green")
        .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
        .setTimestamp()

        interaction.reply({embeds: [embed], ephemeral: true})
       }



    }
}