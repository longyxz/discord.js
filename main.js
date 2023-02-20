const { Client, GatewayIntentBits,Partials, Collection } = require("discord.js");    
const {Guilds, GuildMembers,GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreaMember, Channel} = Partials;

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers,GuildMessages],
  partials: [User, Message, GuildMember, ThreaMember, Channel]
});


const express = require('express');
const http = require('http');
const {Server} = require("ws")
const path = require('path');
const port = 7777
const app = express()
const server = http.createServer(app)
const wss = new Server({server})

client.cooldown = new Collection()
client.commands = new Collection();

client.on("messageCreate",(message)=>{
  
})

require('dotenv').config()
client.login(process.env.TOKEN).then(()=>{
    loadEvents(client);
    loadCommands(client);
});

app.use(express.static(path.join(__dirname, "/website/build")));

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname, "website/build", "index.html"))
})

wss.on("connection", (ws)=>{
  ws.on("message",(message)=>{
    console.log(`Recevied Message: ${message}`);
  })
})

server.listen(port,()=>{
  console.log(`Máy chủ khởi động tại port ${port}`)
})