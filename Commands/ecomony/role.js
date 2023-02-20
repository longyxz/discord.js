const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} =require("discord.js")
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Trang bị hoặc tháo role")
    .addStringOption(option=>
        option.setName("properties")
        .setDescription("Trang bị hoặc tháo role")
        .setRequired(true)
        .addChoices(
            {name: "Trang Bị", value: "on"},
            {name: "Tháo", value: "off"}
        )
    )
    .addStringOption(option=>
        option.setName("role")
        .setDescription("role muốn trang bị")
        .setRequired(true)
        .addChoices(
        {name:"Master Cày Cuốc", value: "mcc"}
        
        )
    ),


    async execute(interaction){
        const {options, guild, user} = interaction;
        const proper = options.getString("properties")
        const role = options.getString("role")
        const customrole1 = guild.roles.cache.get("1076830528763863060")
        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if (!Data) return interaction.reply({content: "❗ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        if(proper ==="on"){
           
            if(role === "mcc"){
                if(Data.CustomeRole1 == false) return interaction.reply({content: "Bạn Chưa Có Role Này"})
                if(Data.CustomeRole1 == true){
                    
                    interaction.reply({content: "Bạn Vừa Trang Bị Vai Trò"})
                }
            }
        }

    }
}








