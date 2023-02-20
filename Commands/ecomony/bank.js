const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("bank")
    .setDescription("Chuyển tiền cho 1 thành viên")
    
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên")
            .setRequired(true)
    )
    .addNumberOption(option=>
        option.setName("money")
            .setDescription("Số tiền cần chuyển")
            
            .setRequired(true)
    )
    .addStringOption(option=>option.setName("content").setDescription("Nội dung chuyển khoảng")),
    async execute(interaction){
        const {options, user, guild} = interaction;
        const member = options.getUser("user")
        const money = options.getNumber("money")
        const sender = user;
        const Content = options.getString("content") || `**${sender.username}** Chuyển tiền`
        

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});

        let userdata =  await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!userdata) return interaction.reply({content: "❌ Thành viên này không có tài khoản economy!!!"});
        const Sender = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id,
            
        })
        const MoneyReceiver = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: member.id,
            
        })

        const errEmbed = new EmbedBuilder()
        .setTitle("❌ Chuyển tiền thất bại!")
        .setColor("Green")
        .setDescription(`Bạn không có nhiều tiên như thế!\n Bạn có: **${Sender.Bank}**💸 ở trong ngân hàng\n Số tiền mà bạn muốn chuyển : **${money}**💸`)
        .setThumbnail("https://cdn3.emoji.gg/emojis/1391_fail.png")
        .setFooter({text: `Request by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        
        if(Sender.Bank < money) return interaction.reply({embeds : [errEmbed]})
        if(sender === member) return interaction.reply({content: "❗ Bạn không thể chuyển cho chính bản thân"})

        const dataSend = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id,
        })
        dataSend.Bank -=money
        dataSend.save()

        const DataReceived = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: member.id,
            
        })
        DataReceived.Bank += money;
        DataReceived.save()

        let nho = Math.ceil(100000000000);
        let lon = Math.floor(999999999999);
        let magiaodich = Math.floor(Math.random() * (lon - nho) + nho); 
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let hour = date.getHours()
        let minu = date.getMinutes()
        let secs = date.getSeconds()

        const succesEmbed = new EmbedBuilder()
        .setTitle(`✅ Chuyển tiền thành công `)
        .setDescription(`Bạn vừa chuyển **${money}**💸 cho **${member}**\n\n **Nội dung Chuyển khoảng**: ${Content}\n\n **Mã Giao Dịch**: ${magiaodich}\n\n **Thời gian chuyển khoản**: ${year}-${month}-${day}-${hour}-${minu}-${secs}`)
        .setColor("Aqua")
        .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
        .setFooter({text: `${sender.username}`, iconURL: sender.displayAvatarURL({dynamic: true})})
        .setTimestamp()


        const memEmbed = new EmbedBuilder()
        .setTitle(`✅ Nhận tiền thành công`)
        .setDescription(`Bạn vừa nhận **${money}**💸 từ **${sender}**\n\n **Nội dung Chuyển khoảng**: ${Content}\n\n **Mã Giao Dịch**: ${magiaodich}\n\n **Thời gian chuyển khoản**: ${year}-${month}-${day}-${hour}-${minu}-${secs}`)
        .setColor("Green")
        .setThumbnail("https://cdn3.emoji.gg/emojis/6488-dripcheckmark.gif")
        .setFooter({text: `${sender.username}`, iconURL: sender.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        try{
            interaction.reply({embeds: [succesEmbed]})
            await member.send({embeds: [memEmbed]})
        }catch(e){
            console.log(e);
        }
        
        

    }
};