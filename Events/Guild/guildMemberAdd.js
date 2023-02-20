const {GuildMember, EmbedBuilder, InteractionCollector} = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    name: "guildMemberAdd",
    async execute(member){
        Schema.findOne({Guild: member.guild.id}, async (err,data)=>{
            if (!data) return;
            let channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;

            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
            .setTitle("             **Thành viên mới**             ")
            .setDescription(data.Msg+` <@${member.id}>`)
            .setColor("White")
            .setFields({name: "Số lượng thành viên: ", value : `${guild.memberCount}`})
            .setImage(data.Gif)
            .setThumbnail(data.Thumbnail)
            .setTimestamp()

            welcomeChannel.send({embeds:[welcomeEmbed]})
            member.roles.add(data.Role)
            
            
        })

    }
};
