const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("doicoin")
    .setDescription("đổi Coin thành tiền💸")
    .addStringOption(option=>
        option.setName("coin")
            .setDescription("số coin cần đổi")
            .setRequired(true)
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const coin = options.getString("coin")

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if (!Data) return interaction.reply({content: "❗ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        if(coin.toLowerCase()=== 'all'){
            if(Data.Coin === 0) return interaction.reply({content: "❗ Bạn không có coin trong người để đổi thành tiền💸!!"})
            const embed =new EmbedBuilder()
            .setTitle("✅ Đổi Coin Thành Công")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Bạn đã **Đổi** thành công **${Data.Coin}**\uD83E\uDE99 thành **${Data.Coin*1000}**💸 vào **Bank**!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})
            Data.Bank += Data.Coin*1000;
            Data.Coin = 0
            await Data.save()
            
            
        } else{
            const Converted = Number(coin)
            if(isNaN(Converted) === true) return interaction.reply({content:`❗ Sô \`Coin\` cần đổi phải là 1 số hoặc \`all\`!`})
            if(Data.Coin < parseInt(Converted) || Converted === Infinity) return interaction.reply({content:`Bạn không nhiều \`Coin\` như thế để đổi thành tiền \n **Số Coin bạn đang có**: ***${Data.Coin}`})

            Data.Bank += parseInt(Converted*1000)
            Data.Coin -= parseInt(Converted)
            Data.Coin = Math.abs(Data.Coin)

            await Data.save();

            const embed =new EmbedBuilder()
            .setTitle("✅ Đổi Coin Thành Công")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
            .setDescription(`Bạn đã **Đổi** thành công **${parseInt(Converted)}** \uD83E\uDE99 thành **${parseInt(Converted*1000)}** 💸 vào **Bank**!`)
            .setFooter({text: ` ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})
        }


    }

};
