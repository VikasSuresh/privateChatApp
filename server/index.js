const app=require('express')();
const http=require('http').createServer(app);
const cors=require('cors');
const io = module.exports.io = require('socket.io')(http)
const mongoose=require('mongoose');
const passport=require('passport');
const bodyParser=require('body-parser')
const config=require('config');

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
console.log(process.env)
mongoose.connect(process.env.db||config.get('db'),{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log('Connected to the DB')})
    .catch((err)=>{console.log('Error in Connecting to DB',err)})

app.use('/user',require('./routes/user'));
app.use(passport.initialize());
require('./middleware/passport')(passport)
io.on('connection',require('./socketManager copy'))


http.listen(process.env.PORT||8000,()=>{
    console.log(`Connected to port ${process.env.PORT||8000}`)
})