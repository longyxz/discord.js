const {SlashCommandBuilder,EmbedBuilder,PermissionFlagsBits,Client} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("unmute 1 thành viên")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn thành viên bạn muốn bật tiếng")
            .setRequired(true)
    ),
    async execute(interaction){
        const {guild, options} = interaction;
        const user = options.getUser("user")
        const member = guild.members.cache.get(user.id)

        const errEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription("Đã xảy ra sự cố. Vui lòng thử lại")
        
        const succesEmbed = new EmbedBuilder()
        .setTitle("**✅ Đã Unmute**")
        .setColor("Random")
        .setDescription(`Unmute ${user}`)
        .setTimestamp();
        if(member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
        return interaction.reply({embeds: [errEmbed], ephemeral: true});


        try{
            await member.timeout(null);
            interaction.reply({embeds: [succesEmbed]})
        }catch(err){
            console.log(err)
        }
    }
};

