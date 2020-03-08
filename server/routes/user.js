const router=require('express').Router();
const mongoose=require('mongoose');
// const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const User=require('../models/users');
const userMessage=require('../models/userMessage')


router.post('/register',(req,res)=>{
    var user= new User({
        name:req.body.name,
        username:req.body.username,
        password:req.body.password
    })
    user.save();
    res.send(true)
})

router.post('/login',(req,res)=>{
    console.log(req.body)
    User.findOne({username:req.body.username})
        .then((data)=>{
            res.send(data);
        }).catch(()=>{
            console.log('err')
        })
})

router.post('/onUnmount',(req,res)=>{
    userMessage.findOne({user:req.body.user})
        .then((data)=>{
            if(data===null){
                const temp=new userMessage({
                    user:req.body.user,
                    chats:req.body.chats,
                    activeChat:req.body.activeChat
                })
                temp.save();
            }else{
                data.chats=req.body.chats
                data.activeChat=req.body.activeChat
                data.save();
                console.log(data)
            }
        }).catch((err)=>{
            console.log(err,'err')
        })

})
router.get('/onMount/:name',(req,res)=>{
    userMessage.findOne({user:req.params.name})
        .then(data=>{
            if(data!==null){
                res.send(data)
            }
            else{
                res.send(null)
            }
            
        })
        .catch(err=>{
            console.log(err)

        })
})
module.exports=router;