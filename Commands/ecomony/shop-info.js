const {SlashCommandBuilder, EmbedBuilder,} = require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shop-info")
    .setDescription("Xem thông tin các mặt hàng được bày bán tại ldxyz'shop"),
    
    async execute(interaction, client){
        const {guild, user, options}= interaction;
        const customrole1 = guild.roles.cache.get("1076830528763863060")

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        
        
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.username}'Shop`)
        .setColor("Gold")
        .setDescription(`**Vip**: \`25000💸\` \n **Thuốc Lá**: \`1000💸\` \n **Bao Cao Su**: \`500💸\``)
        .addFields(
            {name:"**Custom Role:**", value: `${customrole1}: \`20000💸\``}
        )
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
        .setFooter({text: `Thông Tin Shop`})
        .setTimestamp()
        interaction.reply({embeds: [embed]})

 
    }    
}   