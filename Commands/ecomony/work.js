const {Client, SlashCommandBuilder, EmbedBuilder}  = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Kiếm tiền💸"),
    async execute(interaction){
        const {user,guild} = interaction;
        
        let Data = await accountSchema.findOne({Guild: interaction.guild.id, User: user.id}).catch(err=>{})
        if(!Data) return interaction.reply({content: "❌ Bạn không có tài khoản. Hãy tạo 1 tài khoản cho mình!!!"});
        
        const DataReceived = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: user.id,
            
        })
        async function anxin(){
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id,
                
            })
            if(DataReceived.Vip == true){
                let nho = Math.ceil(150);
                let lon = Math.floor(200);
                let tien = Math.floor(Math.random() * (lon - nho) + nho); 
                DataReceived.Wallet += tien;
                DataReceived.save()

                interaction.reply({content: `Bạn đi ăn xin được bố thí **${tien}**💸!`})
            }else{
                let nho1 = Math.ceil(100);
                let lon1 = Math.floor(150);
                let tien1 = Math.floor(Math.random() * (lon1 - nho1) + nho1); 
                DataReceived.Wallet += tien1;
                DataReceived.save()

                interaction.reply({content: `Bạn đi ăn xin được bố thí **${tien1}**💸!`})
            }

        }
        async function shipper(){
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id,
                
            })
            if(DataReceived.Vip == true){
                let nho = Math.ceil(120);
                let lon = Math.floor(200);
                let tien = Math.floor(Math.random() * (lon - nho) + nho); 
                DataReceived.Wallet += tien;
                DataReceived.save()

                interaction.reply({content: `bạn là 🚴Shipper được trả **${tien}**💸!`})
            }else{
                let nho1 = Math.ceil(70);
                let lon1 = Math.floor(150);
                let tien1 = Math.floor(Math.random() * (lon1 - nho1) + nho1); 
                DataReceived.Wallet += tien1;
                DataReceived.save()

                interaction.reply({content: `bạn là 🚴Shipper được trả **${tien1}**💸!`})
            }
        }
        async function traibao(){
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id,
                
            })
            if(DataReceived.Vip == false){
                let nho = Math.ceil(500);
                let lon = Math.floor(1000);
                let tien = Math.floor(Math.random() * (lon - nho) + nho); 
                DataReceived.Wallet += tien;
                DataReceived.save()
                if(tien == 1100){
                    interaction.reply({content: `Bạn làm trai bao đã được 1 👩**Quý Bà** Bo ***${tien}***💸!`})
                }else{
                interaction.reply({content: `Bạn làm 👱trai bao được ***${tien}***💸!`})
                }
            }else if(DataReceived.Vip== true){
                let nho1 = Math.ceil(1000);
                let lon1 = Math.floor(1700);
                let tien1 = Math.floor(Math.random() * (lon1 - nho1) + nho1); 
                DataReceived.Wallet += tien1;
                DataReceived.save()
                
                interaction.reply({content: `Bạn làm trai bao đã được 1 👩**Quý Bà** Bo ***${tien1}***💸!`})
        
            }

            
            
        }
        async function phucvuquanan(){
            const DataReceived = await accountSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id,
                
            })
            if(DataReceived.Vip==true){
                let nho = Math.ceil(250);
                let lon = Math.floor(350);
                let tien = Math.floor(Math.random() * (lon - nho) + nho); 
                DataReceived.Wallet += tien;
                DataReceived.save()
                interaction.reply({content: `Bạn làm 🏃phục vụ quán ăn được trả **${tien}**💸!`})
            }else{
                let nho1 = Math.ceil(150);
                let lon1 = Math.floor(250);
                let tien1 = Math.floor(Math.random() * (lon1 - nho1) + nho1); 
                DataReceived.Wallet += tien1;
                DataReceived.save()
                interaction.reply({content: `Bạn làm 🏃phục vụ quán ăn được trả **${tien1}**💸!`})
            }

        }       



       try{
            
            
                let jobs =  [anxin,shipper,traibao,phucvuquanan]
                jobs[Math.floor(Math.random()* jobs.length)]()
                interaction.setCooldown(5000);
       }catch(e){
            console.log(e);
       }




    }
}