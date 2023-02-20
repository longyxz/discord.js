const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Gửi tiền từ Ví vào Bank")
    .addStringOption(option=>
        option.setName("money")
            .setDescription("số tiền cần gửi")
            
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const money = options.getString("money")

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if (!Data) return interaction.reply({content: "❗ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        if(money.toLowerCase()=== 'all'){
            if(Data.Wallet === 0) return interaction.reply({content: "❗ Bạn không có tiền trong ví để gửi vào ngân hàng!!"})
            const embed =new EmbedBuilder()
            .setTitle("✅ Gửi tiền thành công")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Đã **Gửi** thành công **${Data.Wallet}**💸 vào **Bank**!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})
            Data.Bank += Data.Wallet;
            Data.Wallet = 0
            await Data.save()
            
            
        } else{
            const Converted = Number(money)
            if(isNaN(Converted) === true) return interaction.reply({content:`❗ Sô tiền rút phải là 1 số hoặc \`all\`!`})
            if(Data.Wallet < parseInt(Converted) || Converted === Infinity) return interaction.reply({content:"Bạn không có tiền trong ví để gửi vào ngân hàng"})

            Data.Bank += parseInt(Converted)
            Data.Wallet -= parseInt(Converted)
            Data.Wallet = Math.abs(Data.Wallet)

            await Data.save();

            const embed =new EmbedBuilder()
            .setTitle("✅ Gửi tiền thành công")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Đã **Gửi** thành công **${parseInt(Converted)}**💸 vào **Bank**!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})
        }


    }

};
