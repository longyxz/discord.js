const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const accountSchema = require("../../Models/Account")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tuido")
    .setDescription("kiểm tra túi đồ của bạn"),
    async execute(interaction){
        const {guild, user} = interaction;
        const customrole1 = guild.roles.cache.get("1076830528763863060")
        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        let vip
        if(Data.Vip == true){
            vip = " *nghichtuthon4*"
        }else{
            vip = " Chưa Có Vip"
        }
        if(Data.CustomeRole1 == true){
            role = `${customrole1}`
        }else if(Data.CustomeRole1 == true && Data.CustomeRole2 == true){

        }else{
            role = `Chưa Sở Hữu Role`
        }
        const embed = new EmbedBuilder()
        .setTitle(`Túi Đồ Của ${interaction.user.username}`)
        .setColor("Gold")
        .setDescription(`***VIP*** :${vip}\n**Tiền Trong Bank**: ${Data.Bank}💸\n**Tiền Trong Ví**: ${Data.Wallet}💸\n**Coin**: ${Data.Coin}\uD83E\uDE99\n\n**Thuốc Lá**: ${Data.ThuocLa} \n**Bao Cao Su: **${Data.BaoCaoSu}`)
        .addFields(
            {name: "Số Role Hiện Sở Hữu", value: `${role}`}
        )
        .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

        interaction.reply({embeds: [embed]})
    }
};
