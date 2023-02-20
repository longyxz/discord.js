
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Xem bảng xếp hạng tiền"),
    
    async execute(interaction, accountSchema){
        
        await interaction.deferReply()
        const {guild} = interaction
        const {username, id} =interaction.user;
        const {balance} = accountSchema;

        const ldembed = new EmbedBuilder()
        .setTitle(`🥇 Bảng Xếp Hạng Tiền Của Máy Chủ ${interaction.guild.name}`)
        .setColor("Aqua")
        .setFooter({text: "Bạn không có trong bản xếp hạng"})

        const members = await accountSchema
        .find()
        .sort({balance: -1})
        .catch((err)=>console.log(err))
        const memberIdx = members.findIndex((member)=>member.userId === id)
        ldembed.setFooter({text: `${username}, bạn xếp hạng #${memberIdx+1} với ${balance}`})

        const topTen = members.slice(0,10);
        let desc = "";
        for(let i=0;i<topTen.length;i++){
            let {user}= await interaction.guild.members.fetch(topTen[i].userId)
            if(!user) return;
            let userBalance = topTen[i].balance;
            desc += `**${i+1}. ${user.username}: ** ${userBalance}💸\n`
        }
        if(desc !== ""){
            ldembed.setDescription(desc)
        }
        await interaction.editReply({embeds:[ldembed]})
        
    }
}

