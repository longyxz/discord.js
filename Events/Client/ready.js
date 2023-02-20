const {Client, ActivityType, Activity} = require('discord.js');
const mongoose = require('mongoose');






module.exports ={
    name: "ready",
    once: true,
    
    

    async execute(client){

        client.user.setPresence({
            status: "online",
            activities:[{
                name: "ldxyz",
                type: ActivityType.Playing
            }]
        })



        if(process.env.MONGODB){
            mongoose.connect(process.env.MONGODB).then(()=>{
                console.log("Đã kết nối với MongoDB")
            });
            mongoose.connection.on("disconnected", ()=> console.log("Đã ngắt kết nối với MongoDB"))
        }
        
    }
}