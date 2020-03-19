const app=require('express')();
const http=require('http').createServer(app);
const cors=require('cors');
const io = module.exports.io = require('socket.io')(http)
const mongoose=require('mongoose');
const passport=require('passport');
const bodyParser=require('body-parser')
const config=require('config');
const cookieParser=require('cookie-parser');

app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: function (origin, callback) {
        console.log(origin)
        callback(null, true);
      }
}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
mongoose.connect(process.env.db||config.get('db'),{useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify: false })
    .then(()=>{console.log('Connected to the DB')})
    .catch((err)=>{console.log('Error in Connecting to DB',err)})

app.use('/user',require('./routes/user'));
app.use(passport.initialize());
require('./middleware/passport')(passport)
io.on('connection',require('./socketManager copy'))


http.listen(process.env.PORT||8000,()=>{
    console.log(`Connected to port ${process.env.PORT||8000}`)
})