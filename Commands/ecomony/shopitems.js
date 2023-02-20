const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const accountSchema = require("../../Models/Account");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Mua các mặt hàng được bày bán tại ldxyz'shop (Mua bằng tiền ở Bank)")
    .addStringOption(option=>
        option.setName("item")
            .setDescription("Mặt hàng muốn mua")
            .setRequired(true)
            .addChoices(
                {name: "Vip", value: "vip"},
                {name: "Thuốc lá", value: "cigar"},
                {name: "Bao Cao Su", value: "bcs"},
                {name: "Vai Trò: @Master Cày Cuốc", value: "mcc"}
            )
    ),
    async execute(interaction, client){
        const {guild, user, options}= interaction;
        const customrole1 = guild.roles.cache.get("1076830528763863060")
        const items = options.getString("item")

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let hour = date.getHours()
        let minu = date.getMinutes()
        let secs = date.getSeconds()

        const User = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id
        })
        
        if(items === "vip"){
            if(User.Vip == true) return interaction.reply({content: "Bạn Đã Có Vip!!!!"})
            if(User.Bank <= 24999) return interaction.reply({content: "Bạn Không Đủ Tiền Để Mua Vip!"})
            fs.appendFile('shoplog.txt', `[${year}-${month}-${day}-${hour}:${minu}:${secs}] ${user.username} Đã Mua Vip\n`, err=>{
                if(err){
                    console.err
                    return;
                }   
            })
            const vipembed = new EmbedBuilder()
            .setTitle(`Mua Vip Thành Công`)
            .setColor("Gold")
            .setDescription(`Bạn đã mua ***Vip*** với giá 25000💸`)
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .setFooter({text: `Mua Hàng`})
            .setTimestamp()
            interaction.reply({embeds: [vipembed]})
            User.Bank -= 25000
            User.Vip = true
            User.save()
        }
        if(items === "cigar"){
            if(User.Bank <=999) return interaction.reply({content: "Bạn không đủ tiền để mua Bao Cao Su!"})
            fs.appendFile('shoplog.txt', `[${year}-${month}-${day}-${hour}:${minu}:${secs}] ${user.username} Đã Mua Thuốc Lá\n`, err=>{
                if(err){
                    console.err
                    return;
                }   
            })
            interaction.reply({content:"Bạn vừa mua 1 bao thuốc lá!"})
            User.ThuocLa +=20;
            User.save()
        }
        if(items === "mcc"){
            if(User.Bank <= 19999) return interaction.reply({content: "Bạn Không Đủ Tiền Để Mua Role Này!"})
            fs.appendFile('shoplog.txt', `[${year}-${month}-${day}-${hour}:${minu}:${secs}] ${user.username} Đã Mua Role @Master Phụ Hồ\n`, err=>{
                if(err){
                    console.err
                    return;
                }   
            })
            const mccembed = new EmbedBuilder()
            .setTitle(`Mua Vai Trò Thành Công`)
            .setColor("Blurple")
            .addFields(
                {name: `Bạn Vừa Mua Vai Trò `, value: `${customrole1}\n\n**
                /trangbirole** để bật hoặc tắt role`}
            )
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .setFooter({text: `Mua Hàng`})
            .setTimestamp()
            interaction.reply({embeds:[mccembed]})
            User.Bank -= 20000;
            User.CustomeRole1 = true;
            User.save()
        }




        if(items === null) return interaction.reply({content: "Bạn Phải Chọn 1 Mặt Hàng Để Mua~"})

        
        
    }
};
