const {ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, PermissionFlagsBits} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("xem tất cả các lệnh")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction){
        const emojis = {
            
            administrator: "🛠",
            public: "😀"
        };

        const diretories = [
            ...new Set(interaction.client.commands.map((cmd)=> cmd.folder)),
        ];

        const formatString = (str)=> `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
        const categores = diretories.map((dir)=>{
            const getCommands = interaction.client.commands.filter((cmd)=> cmd.folder === dir).map(cmd =>{
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "Ở đây không có mô tả về lệnh này",

                };
            });
            return {
                diretory: formatString(dir),
                commands: getCommands,
            };
        });
        const embed = new EmbedBuilder()
        .setDescription("Hãy chọn 1 thể loại ở danh sách");
        
        const components = (state) =>[
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("hãy chọn 1 thể loại")
                .setDisabled(state)
                .addOptions(
                    categores.map((cmd)=>{
                        return{
                            label: cmd.diretory,
                            value: cmd.diretory.toLowerCase(),
                            description: `Lệnh từ thể loại ${cmd.diretory} `,
                            emoji: emojis[cmd.diretory.toLowerCase()|| null]
                        }
                    })
                )
            ),
        ];
        const initialMessage =  interaction.reply({embeds:[embed], components: components(false),ephemeral: true});
        const filter = (interaction)=>
        interaction.user.id === interaction.member.id
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
        })
        collector.on("collect",(interaction)=>{
            const [diretory] =interaction.values;
            const category = categores.find(
                (x)=> x.diretory.toLowerCase() === diretory
            );
            const categoryEmbed = new EmbedBuilder()
            
            .setTitle(`Lệnh ${formatString(diretory)} `)
            .setDescription(` một danh sách tất cả các lệnh được phân loại theo ${diretory}`)
            .setColor("Aqua")
            .setFooter()
            .addFields(
                category.commands.map((cmd)=>{
                    return{
                        name: `**${cmd.name}**`,
                        value: `*${cmd.description}*`,
                        inline: true,
                        innerWidth: 12
                    };
                })
            );
            interaction.update({embeds:[categoryEmbed], ephemeral: true});
        });
            
        collector.on("end",()=>{
            initialMessage.edit({components: components(true)})
        })
    }
};
