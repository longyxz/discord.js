const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle, PermissionFlagsBits} = require("discord.js")
const TicketSetup = require("../../Models/TicketSetup");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Tạo 1 vé tin nhắn")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option=>
        option.setName("channel")
            .setDescription("chọn kênh nơi vé sẽ được tạo")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)

    )
    .addChannelOption(option=>
        option.setName("category")
        .setDescription("chọn cha mẹ của nơi vé sẽ được tạo")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    )
    .addChannelOption(option=>
        option.setName("transcripts")
        .setDescription("chọn kênh nơi bản ghi sẽ được gửi")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    )
    .addRoleOption(option=>
        option.setName("handlers")
            .setDescription("chọn một vai trò xử lý vé")
            .setRequired(true)
    )
    .addRoleOption(option=>
        option.setName("everyone")
            .setDescription("gắn thẻ everyone role")
            .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("description")
        .setDescription("đặt mô tả cho vé nhúng")
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("fisrtbutton")
        .setDescription("định dạng (tên của nút, biểu tượng cảm xúc)")
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("secondbutton")
        .setDescription("định dạng (tên của nút, biểu tượng cảm xúc)")
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("thirdbutton")
        .setDescription("định dạng (tên của nút, biểu tượng cảm xúc)")
        .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("fourtbutton")
        .setDescription("định dạng (tên của nút, biểu tượng cảm xúc)")
        .setRequired(true)
    ),

    async execute(interaction){
        const {guild, options}= interaction;

        try{
            const channel = options.getChannel("channel")
            const category = options.getChannel("category")
            const transcripts = options.getChannel("transcripts")

            const handlers = options.getChannel("handlers")
            const everyone = options.getChannel("everyone")
            
            const description = options.getString("description")
            const fisrtbutton = options.getString("fisrtbutton").split(",");
            const secondbutton = options.getString("secondbutton").split(",");
            const thirdbutton = options.getString("thirdbutton").split(",");
            const fourtbutton = options.getString("fourtbutton").split(",");

            const emoji1 = fisrtbutton[1];
            const emoji2 = secondbutton[1];
            const emoji3 = thirdbutton[1];
            const emoji4 = fourtbutton[1];

            await TicketSetup.findOneAndUpdate({GuildID: guild.id},
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [fisrtbutton[0], secondbutton[0],thirdbutton[0],fourtbutton[0]]
                },
                {
                    new: true,
                    upsert: true
                }
            );

            

        const button = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder().setCustomId(fisrtbutton[0]).setLabel(fisrtbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
            new ButtonBuilder().setCustomId(secondbutton[0]).setLabel(secondbutton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
            new ButtonBuilder().setCustomId(thirdbutton[0]).setLabel(thirdbutton[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
            new ButtonBuilder().setCustomId(fourtbutton[0]).setLabel(fourtbutton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4)
        )
        const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor("Aqua")
        await guild.channels.cache.get().send({
            embeds:[embed],
            components:[button]
        })
        interaction.reply({content: "Tin nhắn vé đã được gửi", ephemeral: true})

        } catch(err){
            console.log(err);
            const errEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription("Đã xảy ra sự cố...")

            return interaction.reply({embeds: [errEmbed]})
        }

        
    }

};
