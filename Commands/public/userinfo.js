const {SlashCommandBuilder, EmbedBuilder}= require("discord.js")
const {SlashCommandIntegerOption} = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("xem thông tin của bất kì thành viên nào")
    .addUserOption(option=>
        option.setName("user")
            .setDescription("chọn 1 thành viên")
            .setRequired(true)
    ),
    async execute(interaction){
        const {options} =  interaction;
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const icon = user.displayAvatarURl
        const tag = user.tag;
        
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({name: tag, iconURL: icon})
        .addFields(
            {name:"Tên: ", value:`${user}`, inline: false},
            {name:"Vai trò: ", value: `${member.roles.cache.map(r=>r).join(` ` )}`, inline: false},
            {name:"Đã tham gia server vào:", value:`<t:${parseInt(member.joinedAt/1000)}:R>`, inline: true},
            {name:"Tham gia discord vào: ", value:`<t:${parseInt(member.user.createdAt/1000)}:R>`, inline: true}
        )
        .setFooter({text: `ID thành viên: ${user.id}`})
        .setTimestamp()

        interaction.reply({embeds:[embed]})
    }
};
