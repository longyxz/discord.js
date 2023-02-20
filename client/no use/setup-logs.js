const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} =require("discord.js");
const logSchema = require("../../Models/Logs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-logs")
    .setDescription("thiết lập kênh ghi nhật ký của bạn cho nhật ký kiểm tra")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option=>
        option.setName("channel")
            .setDescription("kênh ghi nhật kí tin nhắn")
            .setRequired(false)
    ),
    async execute(interaction){
        const {options, channel, guildId} =interaction;
        const logChannel = options.getChannel("channel");
        const embed = new EmbedBuilder()
        logSchema.findOne({Guild: guildId}, async(err, data)=>{
            if(!data){
                await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id,

                });
                const embed = new EmbedBuilder() 
                .setColor("Aqua")               
                .setDescription("✅ dữ liệu đã được gửi thành công đến cơ sở dữ liệu ")
                .setTimestamp()
            }else if(data){
                logSchema.findOneAndDelete({Guild: guildId})
                await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id
                })
                const embed = new EmbedBuilder() 
                .setColor("Aqua")               
                .setDescription("✅ dữ liệu cũ đã được thay thế thành công bằng dữ liệu mới ")
                .setTimestamp()
            }
            if(err){
                const embed = new EmbedBuilder() 
                .setColor("Aqua")               
                .setDescription("❌ Đã xảy ra sự cố. Vui lòng liên hệ với nhà phát triển!!!")
                .setTimestamp()
            }
            return interaction.reply({embeds: [embed], ephemeral: true})
        })
    }
};
