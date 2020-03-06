const mongoose=require('mongoose');

const userMessage=new mongoose.Schema({
    user:String,
    chats:Array,
    activeChat:Object
})

module.exports = mongoose.model('usermessage',userMessage)