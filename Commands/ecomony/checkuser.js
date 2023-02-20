const {Client, SlashCommandBuilder, EmbedBuilder}  = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("check-user")
    .setDescription("Xem tiền và túi đồ của 1 người dùng")
    .addUserOption(option=>
        option.setName("user")
        .setDescription("chọn 1 người dùng")
        .setRequired(true)
    ),
    async execute(interaction){
        const {options, guild, user} = interaction;
        const member = options.getUser("user")
        if(interaction.user.id != '878943225308672050') return interaction.reply({content: "lệnh này chỉ dành cho nhà phát triển!!!", ephemeral: true})
        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌  Thành viên này không có tài khoản!!!"});
            
        let vip
        if(Data.Vip == true){
            vip = " Đã Có Vip"
        }else{
            vip = " Chưa Có Vip"
        }
        const embed = new EmbedBuilder()
        .setTitle(`Túi Đồ Của ${member.username}`)
        .setColor("Gold")
        .setDescription(`***VIP*** :${vip}\n**Tiền Trong Bank**: ${Data.Bank}💸\n**Tiền Trong Ví**: ${Data.Wallet}💸\n**Coin**: ${Data.Coin}\uD83E\uDE99\n\n**Thuốc Lá**: ${Data.ThuocLa}\n**Bao Cao Su: **${Data.BaoCaoSu}`)
        .setThumbnail(member.displayAvatarURL({dynamic: true}))
        .setTimestamp()
            
        interaction.reply({embeds: [embed], ephemeral: true});
        

    }
    
};
