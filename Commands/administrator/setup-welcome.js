const {Message, PermissionFlagsBits, Client, SlashCommandBuilder}= require('discord.js');
const welcomeSchema = require("../../Models/Welcome");
const {model, Schema} =require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("thiết lập tin nhắn chào mừng ")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Kênh mà bạn muốn thiết lại tin nhắn chào mừng")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("messages")
        .setDescription("Tin nhắn chào mừng của bạn")
        .setRequired(true)
    )
    
    .addRoleOption(option =>
        option.setName("role-welcome")
        .setDescription("Chọn role mà bạn muốn thành viên nhận khi vừa vào server")
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("link-gif")
            .setDescription("Link Gif cho embed chào mừng")
    )
    .addStringOption(option=>
        option.setName("thumbnail-link")
            .setDescription("Thumbnail mà bạn muốn")
    ),
    async execute(interaction){
        const {options, channel} = interaction;
        const welcomeChannel = options.getChannel("channel");
        const welcomeMessages = options.getString("messages");
        const  roleId = options.getRole("role-welcome")
        const gif = options.getString("link-gif")
        const thumbnail = options.getString("thumbnail-link")

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)){
            interaction.reply({content: "Tui không có quyền để gửi tin nhắn", ephemeral: true});
        }
        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data)=>{
            if(!data){
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessages,
                    Role: roleId.id,
                    Gif: gif,
                    Thumbnail: thumbnail
                    
                })
            }
            interaction.reply({content: "Đã tạo thành công tin nhắn chào mừng", ephemeral: true})
        })
    }
};
