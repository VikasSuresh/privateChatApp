const Mongoose=require('mongoose')

const offlineMessageSchema=new Mongoose.Schema({
    chats:Array
})


module.exports=Mongoose.model('offlinemessage',offlineMessageSchema)