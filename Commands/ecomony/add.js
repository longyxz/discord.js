const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("thêm 1 loại tiền tệ bất kì cho 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option=>
        option.setName("currency")
        .setDescription("Chọn loại tiền tệ bạn muốn thêm")
        .setRequired(true)
        .addChoices(
            {name:"\uD83E\uDE99Coin\uD83E\uDE99", value: "Coin"},
            {name: "💸Money💸", value: "Money"}
        )
    )
    .addUserOption(option=>
        option.setName("user")
            .setDescription("Chọn 1 thành viên")
            .setRequired(true)
    )
    .addNumberOption(option=>
        option.setName("amount")
            .setDescription("Số coin cần cho")
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
        async function addcoin(){
            const CoinReceiver = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            DataReceived.Coin += amount;
            DataReceived.save();
            const embed = new EmbedBuilder()
            .setTitle(`✅ Thêm Coin Thành Công!`)
            .setDescription(`Bạn vừa thêm **${amount}**\uD83E\uDE99 cho **${member}**`)
            .setColor("Aqua")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setFooter({text: `${member.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
    
            interaction.reply({embeds: [embed], ephemeral: true})

        }
        async function addmoney(){
            const MoneyReceiver = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
                
            })
            DataReceived.Bank += amount;
            DataReceived.save();
            const embed = new EmbedBuilder()
            .setTitle(`✅ Thêm Tiền Thành Công!`)
            .setDescription(`Bạn vừa thêm **${amount}**💸 cho **${member}**`)
            .setColor("Aqua")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setFooter({text: `${member.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
    
            interaction.reply({embeds: [embed], ephemeral: true})

        }
        
        if(choice === "Coin"){
            addcoin()
        }else if(choice === "Money"){
            addmoney()
        }else{
            interaction.reply({content: "Bạn phải chọn loại tiền tệ cần thêm!", ephemeral: true})
        }

    }
};