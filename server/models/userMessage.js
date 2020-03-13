const mongoose=require('mongoose');

const userMessage=new mongoose.Schema({
    id:String,
    chats:Array,
})

module.exports = mongoose.model('usermessage',userMessage)