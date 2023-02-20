
const { SlashCommandBuilder, PermissionFlagsBits, ActivityType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("cập nhật sự hiện diện của bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand=>
            subcommand.setName("activity")
                .setDescription("cập nhật hoạt động của bot")
                .addStringOption(option=>
                    option.setName("type")
                        .setDescription("chọn một hoạt động")
                        .setRequired(true)
                        .addChoices(
                            {name:"Playing", value:"Playing"},
                            {name:"Streaming", value:"Streaming"},
                            {name:"Listening", value:"Listening"},
                            {name:"Watching", value:"Watching"},
                            {name:"Competing", value:"Competing"}
    
                        )
            
                )
                .addStringOption(option=>
                    option.setName("activity")
                        .setDescription("đặt hoạt động hiện tại của bạn")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("status")
                .setDescription("cập nhật trạng thái của bot")
                .addStringOption(option=>
                    option.setName("type")
                        .setDescription("chọn một trạng thái")
                        .setRequired(true)
                        .addChoices(
                            {name:"Online", value:"online"},
                            {name:"Ngủ", value:"idle"},
                            {name:"Đừng làm phiền", value:"dnd"},
                            {name:"Tàng hình", value:"invisible"}
                    
    
                        )
                )
        ),
    async execute(interaction,client){
        const {options}= interaction;
        const sub = options.getSubcommand(["activity","status"]);
        const type = options.getString("type");
        const activity = options.getString("activity");
        
        try{
            switch(sub){
                case "activity":
                    switch(type){
                        case "Playing":
                            client.user.setActivity(activity,{type: ActivityType.Playing});
                            break;
                        case "Streaming":
                            client.user.setActivity(activity,{ type: ActivityType.Streaming});
                            break;
                        case "Listening":
                            client.user.setActivity(activity, { type: ActivityType.Listening});
                            break;
                        case "Watching":
                            client.user.setActivity(activity,{type: ActivityType.Watching});
                            break;
                        case "Competing":
                            client.user.setActivity(activity,{type: ActivityType.Competing});
                            break;
                    }
                case "status":
                    client.user.setPresence({status: type})
                    break;
            }
        } catch(err){
            console.log(err);
        }
        
        return interaction.reply({content: `Cập nhật thành công ${sub} thành **${type}**`});
    
    }
}
