const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("xóa 1 loại tiền tệ của 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option=>
        option.setName("currency")
        .setDescription("Chọn loại tiền tệ bạn muốn xóa")
        .setRequired(true)
        .addChoices(
            {name:"\uD83E\uDE99Coin\uD83E\uDE99", value: "Coin"},
            {name: "💸Money💸", value: "Money"},
        )
    )
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên")
            .setRequired(true)
    )
    .addNumberOption(option=>
        option.setName("amount")
            .setDescription("Số tiền cần xóa")
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const member = options.getUser("user")
        const amount = options.getNumber("amount")
        const choice = options.getString("currency")
        
        let userdata =  await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!userdata) return interaction.reply({content: "❌ Thành viên này không có tài khoản economy!!!", ephemeral: true});
        if(interaction.user.id != '878943225308672050') return interaction.reply({content: "lệnh này chỉ dành cho nhà phát triển!!!", ephemeral: true})
        async function removemoney(){
            const MoneyReceiver = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            if(MoneyReceiver.Bank < amount) return interaction.reply("❌ Người dùng này không có nhiều tiền như thế!!")
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            DataReceived.Bank -= amount;
            DataReceived.save();
            const embed = new EmbedBuilder()
            .setTitle(`✅ Xóa Tiền Thành Công`)
            .setDescription(`Bạn vừa xóa **${amount}**💸 của **${member}**`)
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setFooter({text: `${member.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
    
            interaction.reply({embeds: [embed], ephemeral: true})
        }
        async function removecoin(){
            const MoneyReceiver = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            if(MoneyReceiver.Coin < amount) return interaction.reply("❌ Người dùng này không có nhiều tiền như thế!!")
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            DataReceived.Coin -= amount;
            DataReceived.save();
            const embed = new EmbedBuilder()
            .setTitle(`✅ Xóa Coin Thành Công`)
            .setDescription(`Bạn vừa xóa **${amount}**\uD83E\uDE99 của **${member}**`)
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setFooter({text: `${member.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
    
            interaction.reply({embeds: [embed], ephemeral: true})
        }
      
        if(choice === "Money"){
            removemoney()
        }else if(choice === "Coin"){
            removecoin()
        }
        else{
            interaction.reply({content: "Bạn phải chọn loại tiền tệ cần thêm!", ephemeral: true})
        }
        
    }
};
