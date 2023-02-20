const {Client, SlashCommandBuilder, EmbedBuilder}= require("discord.js")
const {loadCommands}  =require("../../Handlers/commandHandler")
const {loadEvents} = require("../../Handlers/eventHandler")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Tải lại lệnh hoặc sự kiện")
    .addSubcommand(subcommand=>
        subcommand.setName("commands")
        .setDescription("Tải lại lệnh")
    )
    .addSubcommand(subcommand=>
        subcommand.setName("events")
        .setDescription("tải lại sự kiện")
    ),
    async execute(interaction, client){
        const {user} = interaction;

        if(user.id != '878943225308672050') return interaction.reply({content: "Lệnh này chỉ dành nhà phát triển", ephemeral: true})
        const sub = interaction.options.getSubcommand()

        switch(sub){
            case "commands":{
                loadCommands(client)
                interaction.reply({content:"Đã tải lại lệnh"})
                console.log(`${user.username} đã tải lại lệnh`);
            }
            break;
            case "events":{
                loadEvents(client)
                interaction.reply({content:"Đã tải lại sự kiện"})
                console.log(`${user.username} đã tải lại sự kiện`);
            }
            break;
        }
    }
};
