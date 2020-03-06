const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    }
})

module.exports =User= mongoose.model('user',userSchema);