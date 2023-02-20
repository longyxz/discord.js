const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require("discord.js")
const client = require("../../main")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("nhạc")
    .addSubcommand(subcommand=>
        subcommand.setName("play")
        .setDescription("chơi nhạc")
        .addStringOption(option=>
            option.setName("query")
            .setDescription("nhập tên hoặc link cho nhạc")
            .setRequired(true)
            )
            

    )
    .addSubcommand(subcommand=>
        subcommand.setName("volume")
        .setDescription("Chỉnh âm lượng của bot")
        .addNumberOption(option=>
            option.setName("percent")
            .setDescription("1-100")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
            )
            

    )
    .addSubcommand(subcommand=>
        subcommand.setName("options")
        .setDescription("chọn 1 tùy chọn")
        .addStringOption(option=>
            option.setName("options")
            .setDescription("chọn 1 tùy chọn")
            .setRequired(true)
            .addChoices(
                {name: "queue", value: "queue"},
                {name: "skip", value: "skip"},
                {name: "pause", value: "pause"},
                {name: "resume", value: "resume"},
                {name: "stop", value: "stop"},
            )
        )
    ),
    async execute(interaction){
        const {options, member, guild, channel} = interaction;
        const subcommand = options.getSubcommand()
        const query = options.getString("query")
        const volume = options.getNumber("percent")
        const option = options.getString("options")
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();
        if(!voiceChannel){
            embed.setColor("Red").setDescription("Bạn phải vào voice thì mới dùng được lệnh này!")
            return interaction.reply({embeds: [embed]})
        }
        if(!member.voice.channelId === guild.members.me.voice.channelId){
            embed.setColor("Red").setDescription(`Bạn không thể sử dụng lệnh này khi bot đang hoạt động tại <#${guild.members.me.voice.channelId}>!`)
            return interaction.reply({embeds: [embed]})
        }
        try{
            switch(subcommand){
                case "play":
                    client.distube.play(voiceChannel, query, {textChannel: channel, member: member})
                    return interaction.reply({content: "🎶"})
                case "volume":
                    client.distube.setVolume(voiceChannel, volume)
                    return interaction.reply({content: `🎙 âm lượng đã được chỉnh thành ${volume}% !`})
                case "settings":
                    const queue = await client.distube.getQueue(voiceChannel)
                    if(!queue){
                        return interaction.reply({content: "không có hàng đợi đang hoạt động"})
                
                    }
                    switch(option){
                        case "skip":
                            await queue.skip(voiceChannel)
                            return interaction.reply({content: "⏩ bạn nhạc này đã được bỏ qua!"})
                        case "skip":
                            await queue.stop(voiceChannel)
                            return interaction.reply({content: "⏹ bạn nhạc này đã được dừng lại!"})
                        case "pause":
                            await queue.pause(voiceChannel)
                            return interaction.reply({content: "▶ bạn nhạc này đã được tạm dừng!"})
                        case "resume":
                            await queue.resume(voiceChannel)
                            return interaction.reply({content: "⏮ bạn nhạc này đã được phát lại!"})
                        case "queue":

                            
                            return interaction.reply({content: `${queue.song.map((song, id)=> `\n**${id+1}** ${song.name}-\`${song.formattedDuration}\``)}`})
                    }
            }

        }catch(err){
            return interaction.reply({content: "Đã Xãy Ra Lỗi!!!"})
            console.log(err);
        }

    }
};
