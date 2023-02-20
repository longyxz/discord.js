const {model, Schema} = require("mongoose")

let accountSchema  =  new Schema({
    Guild: String,
    User: String,
    UserTag: String,
    Bank: Number,
    Wallet: Number,
    Coin: Number,
    Vip: Boolean,
    ThuocLa: Number,
    BaoCaoSu: Number,
    CustomeRole1: Boolean,
    CustomeRole2: Boolean
})

module.exports = model("Account", accountSchema)