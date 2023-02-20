const { CommandInteraction } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
       
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!interaction.guild) return interaction.reply({ content: "Không thể dùng lệnh ngoài server", ephemeral: true });

        if (!command) {
            interaction.reply({ content: "lệnh này không tồn tại", ephemeral: true });
        }
        if(command == "role"){
            
            const customrole1 = guild.roles.cache.get("1076830528763863060")
            interaction.roles.add(customrole1)
        }
        const cooldownData = `${interaction.user.id}/${interaction.commandName}`
        if(client.cooldown.has(cooldownData)){
            const time = ms(client.cooldown.get(cooldownData) - Date.now());

            return interaction.reply({content: `⏱ | Bạn cần phải đợi ${time} nữa thì mới có thể sử dụng lệnh này!`, ephemeral: true});
        }
        interaction.setCooldown = (time) =>{
            client.cooldown.set(cooldownData, Date.now()+ time)
            setTimeout(()=> client.cooldown.delete(cooldownData), time)
        }

        command.execute(interaction, client);
        
            
            
        
    }
};                                                                                                                      
