const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("doanicon")
    .setDescription("Chơi đoán icon")
    .addStringOption(option=>
        option.setName("money")
            .setDescription("số tiền💸 cược (tiền trong ví)")
            .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("type")
        .setDescription("chọn 1 trong 6 icon")
        .setRequired(true)
        .addChoices(
            {name: "😂", value: "😂"},
            {name: "😀", value: "😀"},
            {name: "😏", value: "😏"},
            {name: "😍", value: "😍"},
            {name: "🤢", value: "🤢"},
            {name: "😜", value: "😜"},
        )
    ),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const money = options.getString("money")
        const icon = options.getString("type")



        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if (!Data) return interaction.reply({content: "❗ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        if(Data.Wallet === 0) return interaction.reply({content: "❗ Bạn không có tiền trong ví để chơi **Đoán Icon**!!"})
        if(money > Data.Wallet) return interaction.reply({content: `❗ Bạn không có nhiều tiền trong ví để chơi **Đoán Icon**!!\n 👛Số tiền trong ví của bạn: ${Data.Wallet}💸`})
        let icons = ["😂","😀","😏","😍","🤢","😜"]
        let random = Math.floor(Math.random()* icons.length)

        if(icon === icons[random]){
            const embed =new EmbedBuilder()
            .setTitle("Trò Chơi May Mắn!!")
            .setColor("Green")
            .setThumbnail("https://cdn3.emoji.gg/emojis/9069-winner-w.gif")
            .setDescription(`Kết Quả Icon\n${icon}\nBạn Chọn\n${icon}\n\nBạn đã thắng **Đoán Icon** và nhận được **${money*2}**💸`)
            .setFooter({text: `Win Game!!`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [embed]})

            Data.Wallet += money*2
            await Data.save()

        }else{
            const thua =new EmbedBuilder()
            .setTitle("Trò Chơi May Mắn!!")
            .setColor("Red")
            .setThumbnail("https://cdn3.emoji.gg/emojis/5742-youlose.png")
            .setDescription(`Kết Quả Icon\n${icons[random]}\nBạn chọn\n${icon}\n\nBạn đã thua **Đoán Icon** và mất hết ***${money}***💸 tiền cược `)
            .setFooter({text: `Lose Game!!`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            interaction.reply({embeds: [thua]})

            Data.Wallet -= money;
            Data.save()

        }

    


    }

};
