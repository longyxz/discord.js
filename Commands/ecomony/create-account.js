const {Client, SlashCommandBuilder, EmbedBuilder}  = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("create-account")
    .setDescription(`tạo 1 tài khoản để chơi economy của bot`),
    async execute(interaction){
        const {options, guild, user} = interaction;
        const userTag = `${interaction.user.username}#${interaction.user.discriminator}`;

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(Data) return interaction.reply({content: "❗ Bạn đã có tài khoảng!!!"});
            

        Data = new accountSchema({
            Guild: interaction.guild.id,
            User: user.id,
            UserTag: userTag,
            Bank: 1000,
            Wallet: 1000,
            Coin: 0,
            Vip: false,
            ThuocLa: 0,
            BaoCaoSu: 0,
            CustomeRole1: false,
            CustomeRole2: false
        });
        
        await Data.save()
                
        interaction.reply({content: "✅ Bạn đã tạo thành công tài khoảng economy!!!"})
          
            
        

    }
    
};
