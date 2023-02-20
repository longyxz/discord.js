const {SlashCommandBuilder, CommandInteraction,PermissionFlagsBits} = require('discord.js');


module.exports ={
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("kiểm tra ms"),
    execute(interaction,client){
        interaction.reply({content: `Pong~ ${client.ws.ping}ms!`})
    },
};