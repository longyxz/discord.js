const {model, Schema} = require("mongoose");

let logSchema= new Schema({
    GuildId: String,
    Channel: String
});

module.exports = model("Logs", logSchema)