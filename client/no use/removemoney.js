const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove-money")
    .setDescription("xóa tiền từ 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên")
            .setRequired(true)
    )
    .addNumberOption(option=>
        option.setName("money")
            .setDescription("Số tiền cần lấy")
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const member = options.getUser("user")
        const money = options.getNumber("money")
        
        let userdata =  await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!userdata) return interaction.reply({content: "❌ Thành viên này không có tài khoản economy!!!", ephemeral: true});
        const MoneyReceiver = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: member.id,
            
        })
        if(MoneyReceiver.Bank < money) return interaction.reply("❌ Người dùng này không có nhiều tiền như thế!!")
        const DataReceived = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: member.id,
            
        })
        DataReceived.Bank -= money;
        DataReceived.save();
        const embed = new EmbedBuilder()
        .setTitle(`✅ xóa tiền thành công`)
        .setDescription(`Bạn vừa xóa ***${money}***💸 từ **${member}**`)
        .setColor("Aqua")
        .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
        .setFooter({text: `${member.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
        .setTimestamp()

        interaction.reply({embeds: [embed], ephemeral: true})
    }
};
