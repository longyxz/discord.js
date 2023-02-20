const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} =require("discord.js")
const warningSchema = require("../../Models/Warning");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warning")
    .setDescription("hệ thống cảnh báo")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand=>
        subcommand.setName("add")
            .setDescription("Thêm cảnh báo cho thành viên")
            .addUserOption(option=>
                option.setName("user")
                    .setDescription("Chọn 1 thành viên")
                    .setRequired(true)
            )
            .addStringOption(option=>
                option.setName("reason")
                    .setDescription("lí do cảnh báo")
                    .setRequired(false)
            )
            .addStringOption(option=>
                option.setName("evidence")
                    .setDescription("chứng minh bằng chứng")
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand=>
        subcommand.setName("check")
            .setDescription("kiểm tra cảnh báo của thành viên")
            .addUserOption(option=>
                option.setName("user")
                    .setDescription("Chọn 1 thành viên")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand=>
        subcommand.setName("remove")
            .setDescription("xóa 1 cảnh báo cụ thể từ thành viên")
            .addUserOption(option=>
                option.setName("user")
                    .setDescription("Chọn 1 thành viên")
                    .setRequired(true)
            )
            .addIntegerOption(option=>
                option.setName("id")
                    .setDescription("cung cấp id cảnh báo")
                    .setRequired(false)
            )                                           
    )
    .addSubcommand(subcommand=>
        subcommand.setName("clear")
            .setDescription("xóa tất cả cảnh báo từ thành viên")
            .addUserOption(option=>
                option.setName("user")
                    .setDescription("Chọn 1 thành viên")
                    .setRequired(true)
            )
    ), 
    async execute(interaction){
        const {options, guildId, user, member} = interaction;
        const sub = options.getSubcommand(["add","check","remove","clear"]);
        const target = options.getUser("user")
        const reason = options.getString("reason") || "Không cung cấp lí do";
        const evidence = options.getString("evidence") || "Không cung cấp bằng chứng"
        const warnId = options.getInteger("id") -1;
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();
        const userTag = `${target.username}#${target.discriminator}`;

        
        
        const errEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${userTag} | || ${target.id} || không có cảnh báo`)
        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
        .setTimestamp();
        const removeEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Id cảnh báo của ${userTag}: ${warnId+1} đã được gỡ bỏ `)
        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        const clearEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`Cảnh báo của ${userTag} đã được xóa    | ||${target.id}||  `)
        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
        .setTimestamp()
        switch(sub){
            case "add":
                warningSchema.findOne({GuildID:guildId, UserID: target.id, UserTag: userTag}, async (err,data)=>{
                    if(err) throw err;

                    if(!data){
                        data = new warningSchema({
                            GuildID: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                ExecuterId: user.id,
                                ExecuterTag: user.tag,
                                Reason: reason,
                                Evidence: evidence,
                                Date: warnDate,
                                }
                            ]
                        });
                    }else {
                        const warnContent = {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            Evidence: evidence,
                            Date: warnDate,
                        }
                        data.Content.push(warnContent)
                    }
                    data.save();
                })
                const addEmbed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`
                Đã thêm cảnh báo: ${userTag} | ||${target.id}||
                **Lí do**: ${reason}
                **Bằng chứng**: ${evidence}`)
                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                .setTimestamp();
                
        
                interaction.reply({embeds: [addEmbed]})
                await target.send("bạn đã bị cảnh báo!").catch( err=>{
                    console.log(err)
                    
                    
                })
                break;
            case "check":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data)=>{
                    if (err) throw err;
                    if(data){
                        const checkEmbed = new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor("")
                        .setDescription(`${data.Content.map((w,i)=>
                        `**ID**: ${i+1} | ${userTag}
                        **Bởi**:${w.ExecuterTag}
                        **Ngày**:${w.Date}
                        **Lí do**: ${w.Reason}
                        **Bằng chứng**: ${w.Evidence}\n\n
                        `).join(" ")}`)
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                        .setTimestamp()
                        interaction.reply({embeds: [checkEmbed]})

                    } else{
                        interaction.reply({embeds: [errEmbed]})
                    }
                })
                break;
            case "remove":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data)=>{
                    if (err) throw err;
                    if(data){
                        data.Content.splice(warnId, 1)
                        data.save();
                        interaction.reply({embeds: [removeEmbed]})

                    } else{
                        interaction.reply({embeds: [errEmbed]})
                    }
                })
                break;
            case "clear":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data)=>{
                    if (err) throw err;
                    if(data){
                        await warningSchema.findOneAndDelete({GuildID: guildId, UserID: target.id, UserTag: userTag})
                        
                        interaction.reply({embeds: [clearEmbed]})

                    } else{
                        interaction.reply({embeds: [errEmbed]})
                    }
                })

                break;
        }


    }
};

