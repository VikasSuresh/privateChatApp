import React from "react";
import io from "socket.io-client";
import SideBar from "../../Components/SideBar";

class Chat extends React.Component<any,any>{
   state={
       users:[{
        id:'',
        name:'',
        socketid:''
    }],
    recieverId:'',
    msg:'',
    chats:[{
        sid:'',
        msg:''
    }],
    socket:io.connect('http://localhost:8000')
   }
   componentDidMount(){
        const {socket}=this.state
        socket.on('connect',()=>{
            console.log('connected')
        })
        socket.emit('usersConnected',{id:this.props.match.params.id,name:this.props.match.params.name})
        socket.on('push',(data:any)=>{
            const {sid,msg}:any=JSON.parse(data)
            this.setState((prevState:any)=>({
                ...prevState,
                chats:[
                    ...prevState.chats,
                    {sid:sid,msg:msg}
                ]
            }))
        })
        socket.on('connectedUsers',(users:any)=>{
            this.setState({
                users:users
            })
        })
   }
   handleText=(e:any)=>{
        this.setState({
            msg:e.target.value
        })
   }
   submit=(e:any)=>{
       e.preventDefault();
        this.state.socket.emit('privateMessage',{rid:this.state.recieverId,sid:this.props.match.params.id,msg:this.state.msg})
   }
   onUserClick=(e:any)=>{
        this.setState({
            recieverId:e.target.value
        })
   }
    render(){
        console.log(this.state.chats)
       return(
           <div className="container">
                <div className="row">
                <SideBar/>
                {/* <div className="col-sm-4">
                    {this.state.users.filter(m=>m.id!==this.props.match.params.id).map((m,index)=>(
                        <div key={index}>
                        <button onClick={this.onUserClick} value={m.id}>
                            {m.name}
                        </button><br/>
                        </div>
                    ))}
                </div>
                    <div className="col-sm-4">
                        {this.state.chats.filter(m=>m.sid===this.state.recieverId).map(m=>m.msg)}
                        <form onSubmit={this.submit}>
                        <input onChange={this.handleText} type="text"></input>
                        <button type='submit'>submit</button>
                        </form>
                    </div> */}
                </div>
            </div>
       )
           
        
   }
   
}

export default Chat;