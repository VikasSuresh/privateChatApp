const mongoose=require('mongoose');

const userMessage=new mongoose.Schema({
    chats:Array
})

module.exports = mongoose.model('usermessage',userMessage)