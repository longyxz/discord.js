const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("cuoptien")
    .setDescription("Cướp tiền💸 của 1 thành viên")
    
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên")
            .setRequired(true)
    ),

    async execute(interaction){
        const {options, user, guild} = interaction;
        const member = options.getUser("user")
        const cuop = user;

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});

        let userdata =  await accountSchema.findOne({Guild: interaction.guild.id, User: member.id}).catch(err=>{})
        if(!userdata) return interaction.reply({content: "❌ Thành viên này không có tài khoản economy!!!"});
        
        

        const errEmbed = new EmbedBuilder()
        .setTitle("❌ Cướp tiền thất bại!")
        .setColor("Red")
        .setDescription(`Bạn đã thất bại trong việc **cướp tiền**💸 và bị đánh sưng chim!`)
        .setThumbnail("https://cdn3.emoji.gg/emojis/1391_fail.png")
        .setFooter({text: cuop.username, iconURL: cuop.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        
        const nguoibicuop = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: member.id,
        })
        if(nguoibicuop.Wallet <= 249) return interaction.reply({content: "❗ Bạn không thể cướp tiền💸 của người này vì số tiền của này quá ít!!"})
        
        if(cuop === member) return interaction.reply({content: "❗ Bạn không thể cướp tiền💸 của chính bản thân"})
        

        async function cuoptienthanhcong(){
            const nguoibicuop = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: member.id,
            })
            let nho = Math.ceil(150);
            let lon = Math.floor(250);
            let money = Math.floor(Math.random() * (lon - nho) + nho); 

            await interaction.reply({content: `\`Bạn đã cướp thành công ${money}💸 từ ${member.username}!\``})

            nguoibicuop.Wallet -=money
            nguoibicuop.save();
    
            const nguoicuop = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: cuop.id,
                
            })
            nguoicuop.Wallet += money;
            nguoicuop.save()
            await member.send({content:`Bạn đã vừa bị ${cuop} cướp 1 số tiền!.Hãy chuyển tất cả số tiền bạn có vào Bank để tránh bị cướp!`})
        }
        async function cuoptienthatbai(){
            const errEmbed = new EmbedBuilder()
            .setTitle("❌ Cướp tiền thất bại!")
            .setColor("Red")
            .setDescription(`Bạn đã thất bại trong việc **cướp tiền**💸 và bị đánh sưng chim!`)
            .setThumbnail("https://cdn3.emoji.gg/emojis/1391_fail.png")
            .setFooter({text: "Cướp thất bại" ,iconURL: cuop.displayAvatarURL({dynamic: true})})
            .setTimestamp()

            await interaction.reply({embeds : [errEmbed]})


        }
        

        try{
            let cuop =  [cuoptienthanhcong,cuoptienthatbai,cuoptienthatbai,cuoptienthanhcong,cuoptienthanhcong,cuoptienthatbai]
            cuop[Math.floor(Math.random()* cuop.length)]()
            interaction.setCooldown(6000);
            
        }catch(e){
            console.log(e);
        }
        
        

    }
};