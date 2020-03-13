const app=require('express')();
const http=require('http').createServer(app);
const cors=require('cors');
const io = module.exports.io = require('socket.io')(http)
const mongoose=require('mongoose');
const passport=require('passport');
const bodyParser=require('body-parser')

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log('Connected to the DB')})
    .catch(()=>{console.log('Error in Connecting to DB')})

app.use('/user',require('./routes/user'));
app.use(passport.initialize());
require('./middleware/passport')(passport)
io.on('connection',require('./socketManager copy'))


http.listen('8000',()=>{
    console.log('Connected to port 8000')
})