const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Rút tiền từ Bank sang Ví")
    .addStringOption(option=>
        option.setName("money")
            .setDescription("số tiền cần chuyển")
            
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const money = options.getString("money")

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if (!Data) return interaction.reply({content: "❗ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        if(money.toLowerCase()=== 'all'){
            if(Data.Bank === 0) return interaction.reply({content: "❗ Bạn không có tiền ở ngân hàng để rút vào ví!!"})

            const embed =new EmbedBuilder()
            .setTitle("✅ Rút tiền thành công")
            .setColor("Gold")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Đã rút thành công **${Data.Bank}**💸 vào ví!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})

            Data.Wallet += Data.Bank;
            Data.Bank = 0
            
            await Data.save()

        } else{
            const Converted = Number(money)
            if(isNaN(Converted) === true) return interaction.reply({content:`❗ Sô tiền rút phải là 1 số hoặc \`all\`!`})
            if(Data.Bank < parseInt(Converted) || Converted === Infinity) return interaction.reply({content:"❗ Bạn không có tiền ở ngân hàng để rút vào ví của bạn"})

            Data.Wallet += parseInt(Converted)
            Data.Bank -= parseInt(Converted)
            Data.Bank = Math.abs(Data.Bank)

            await Data.save();
            
            const embed =new EmbedBuilder()
            .setTitle("✅ Rút tiền thành công")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Đã rút thành công **${parseInt(Converted)}**💸 vào ví!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})
        }


    }

};
