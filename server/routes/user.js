const router=require('express').Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User=require('../models/users');
const userMessage=require('../models/userMessage')



router.post('/register',(req,res)=>{
    const {errors,isValid}=validateRegisterInput(req.body);
    
    if (!isValid) {
        return res.send(errors);
      }
    User.findOne({username:req.body.username})
      .then(user=>{
        if (user) {
            return res.json({ username: "User already exists" });
          }else{
            var newUser= new User({
                name:req.body.name,
                username:req.body.username,
                password:req.body.password
            })
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if (err) throw err;
                    newUser.password=hash
                    newUser.save()
                        .then(() => res.json(true))
                        .catch(err => console.log(err));
                })
            })
          }
      }) 
})

router.post('/login',(req,res)=>{
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid){
        return res.json(errors);
    }
    User.findOne({username:req.body.username})
        .then((user)=>{
            if (!user) {
                return res.json({ username: "User not found" });
              }
            bcrypt.compare(req.body.password,user.password)
              .then(isMatch=>{
                  if(isMatch){
                      jwt.sign({id:user._id,name:user.name},"secret",{
                        expiresIn: 31556926 // 1 year in seconds
                      },(err,token)=>{
                            userMessage.findById(user._id)
                            .then(data=>{
                            if(data===null){
                                var result= new userMessage({
                                    _id:user._id,
                                    chats:[]
                                })
                                result.save()
                            }
                        })
                        res.cookie('token',token,{sameSite:"none",secure:true}).send({
                            success:true
                        })
                    })
                  }else {
                    return res.json({ password: "Password incorrect" });
                  }
              })
        }).catch(()=>{
            console.log('err')
        })
})

router.post('/onUnmount',(req,res)=>{
    userMessage.findOne({id:req.body.id})
        .then((data)=>{
            if(data===null){
                const temp=new userMessage({
                    id:req.body.id,
                    chats:req.body.chats,
                    // activeChat:req.body.activeChat
                })
                temp.save().catch((err)=>console.log("error in saving into db1",err))
            }else{
                data.chats=req.body.chats
                // data.activeChat=req.body.activeChat
                data.save().catch((err)=>console.log("error in saving into db2",err))
            }
            res.send(true)
        }).catch((err)=>{
            console.log(err,'err')
        })

})
router.get('/onMount/:id',(req,res)=>{
    userMessage.findOne({_id:req.params.id})
        .then(data=>{
            if(data!==null){
                User.find().then(userData=>{
                    const finalArray = [...new Set([...[...new Set(data.chats.map(item => item.sid))],...[...new Set(data.chats.map(item=>item.rid))]])]
                    let x=userData.filter(u=>finalArray.includes(u.id)).filter(u=>u.id!==req.params.id)
                    res.send({data:data,prevUsers:x})
                }).catch(err=>{
                    console.log(err)
                })
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