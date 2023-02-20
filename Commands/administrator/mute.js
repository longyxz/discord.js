const {SlashCommandBuilder,EmbedBuilder,PermissionFlagsBits, Client} = require("discord.js");
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("mute thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên để mute")
            .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("time")
            .setDescription("thời gian mute")
            .setRequired(true)
    )
    .addStringOption(option=>
        option.setName("reason")
            .setDescription("lí do thành viên đó bị mute")
    ),
    async execute(interaction,client){
        const {guild, options} = interaction;
        const user = options.getUser("user");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("time");
        const convertedTime = ms(time);
        const reason = options.getString("reason") || "Không lí do";

        const cantmuteEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("❌ Tui không thể mute người này!")
        const notperEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("❌ Tui không có quyền để mute!")
        const errEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("❌ Vui lòng nhập thời gian mute!")
        const botEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("❌ Bạn không thể mute tui!")

        const succesEmbed = new EmbedBuilder()
        .setTitle("**✅ Đã Mute**")
        .setColor("Random")
        .setDescription(`Mute thành công ${user}`)
        .addFields(
            {name: "Lí do ", value: `${reason}`, inline: true },
            {name: "Thời gian mute ", value: `${time}`, inline: true}
        )
        .setTimestamp();

        if(member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [cantmuteEmbed], ephemeral: true});
        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
        return interaction.reply({embeds: [notperEmbed], ephemeral: true});

        if(!convertedTime)
        return interaction.reply({embeds: [errEmbed], ephemeral: true});
        
        try{
            await member.timeout(convertedTime, reason);
            interaction.reply({embeds: [succesEmbed]})
        }catch(err){
            console.log(err)
        }
        

    
        
    }   

};
