const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder}= require("discord.js")
const ticketSchema = require("../../Models/Ticket");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Hoạt động của vé")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option=>
        option.setName("action")
            .setDescription("Thêm hoặc xóa 1 thành viên khỏi vé")
            .setRequired(true)
            .addChoices(
                {name: "Add", value: "add"},
                {name:"Remove", value: "remove"}
            )

    )
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn người dùng từ máy chủ discord để thực hiện hành động trên")
            .setRequired(true)

    ),
    async execute(interaction){
        const {options, guildId, channel} = interaction;
        const action = options.getString("action")
        const member = options.getUser("user")
        const embed = new EmbedBuilder()

        switch(action){
            case "add":
                ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err,data)=>{
                    if(err) throw err;
                    if(!data) return interaction.reply({embeds: [embed.setColor("Aqua").setDescription("Đã xảy ra sự cố. Vui lòng thử lại")], ephemeral: true})
                    if(data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor("Aqua").setDescription("Đã xảy ra sự cố. Vui lòng thử lại")], ephemeral: true})

                    data.MembersID.push(member.id);

                    channel.permissionOverwrites.edit(member.id,{
                        SendMessages: true,
                        ViewChannel: true,
                        ReadMessageHistory: true,
                    })
                    interaction.reply({embeds:[embed.setColor("Aqua").setDescription(`${member} đã được thêm vào vé`)]})
                    data.save()
                });
                break;
            case "remove":
                ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err,data)=>{
                    if(err) throw err;
                    if(!data) return interaction.reply({embeds: [embed.setColor("Aqua").setDescription("Đã xảy ra sự cố. Vui lòng thử lại")], ephemeral: true})
                    if(!data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor("Aqua").setDescription("Đã xảy ra sự cố. Vui lòng thử lại")], ephemeral: true})

                    data.MembersID.remove(member.id);

                    channel.permissionOverwrites.edit(member.id,{
                        SendMessages: false,
                        ViewChannel: false,
                        ReadMessageHistory: false,
                    })
                    interaction.reply({embeds:[embed.setColor("Aqua").setDescription(`${member} đã được xóa khỏi vé`)]})
                    data.save()
                });
                break
        }
    }
};
