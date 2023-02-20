const {SlashCommandBuilder, Client, Embedbuilder} = require('discord.js');
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete-account")
    .setDescription("Xóa tài khoản economy của bạn"),
    async execute(interaction){
        const {options, guild, user} = interaction;

        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❗ Bạn không có tài khoảng để xóa!!!"});

        await Data.delete();

        interaction.reply({content: "✅ Bạn đã xóa tài khoản economy của mình!!!"})
            
            
        
    }

};
